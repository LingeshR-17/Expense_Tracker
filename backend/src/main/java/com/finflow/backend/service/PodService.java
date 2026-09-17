package com.finflow.backend.service;

import com.finflow.backend.dto.SettlementTransaction;
import com.finflow.backend.entity.*;
import com.finflow.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PodService {
    private final PodRepository podRepository;
    private final PodMemberRepository podMemberRepository;
    private final PodExpenseShareRepository podExpenseShareRepository;
    private final UserRepository userRepository;
    private final DebtMinimizationService debtMinimizationService;

    @Transactional
    public Pod createPod(String name, UUID creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pod pod = Pod.builder()
                .name(name)
                .createdBy(creator)
                .build();
        pod = podRepository.save(pod);

        PodMember member = PodMember.builder()
                .pod(pod)
                .user(creator)
                .build();
        podMemberRepository.save(member);

        return pod;
    }

    @Transactional
    public void inviteMember(UUID podId, String email) {
        Pod pod = podRepository.findById(podId)
                .orElseThrow(() -> new RuntimeException("Pod not found"));

        Optional<User> optionalUser = userRepository.findByEmail(email);

        PodMember.PodMemberBuilder builder = PodMember.builder().pod(pod);
        if (optionalUser.isPresent()) {
            builder.user(optionalUser.get());
        } else {
            builder.pendingEmail(email);
        }

        podMemberRepository.save(builder.build());
    }

    @Transactional
    public void addTransactionToPod(UUID podId, Transaction transaction, Map<UUID, BigDecimal> splits, PodExpenseShare.SplitType splitType) {
        Pod pod = podRepository.findById(podId)
                .orElseThrow(() -> new RuntimeException("Pod not found"));
                
        // Validation: Ensure custom split adds up to transaction amount
        if (splitType == PodExpenseShare.SplitType.CUSTOM) {
            BigDecimal totalSplit = splits.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            if (totalSplit.compareTo(transaction.getAmount()) != 0) {
                throw new IllegalArgumentException("Custom split amounts must add up exactly to the transaction amount.");
            }
        }

        for (Map.Entry<UUID, BigDecimal> entry : splits.entrySet()) {
            User user = userRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            PodExpenseShare share = PodExpenseShare.builder()
                    .pod(pod)
                    .transaction(transaction)
                    .user(user)
                    .owedAmount(entry.getValue())
                    .splitType(splitType)
                    .settled(false)
                    .build();

            podExpenseShareRepository.save(share);
        }
    }

    @Transactional(readOnly = true)
    public List<SettlementTransaction> getSettlementPlan(UUID podId) {
        List<PodExpenseShare> unsettledShares = podExpenseShareRepository.findByPodIdAndSettledFalse(podId);

        Map<UUID, BigDecimal> netBalances = new HashMap<>();

        Map<Transaction, List<PodExpenseShare>> sharesByTx = new HashMap<>();
        for (PodExpenseShare share : unsettledShares) {
            sharesByTx.computeIfAbsent(share.getTransaction(), k -> new ArrayList<>()).add(share);
        }

        for (Map.Entry<Transaction, List<PodExpenseShare>> entry : sharesByTx.entrySet()) {
            Transaction tx = entry.getKey();
            List<PodExpenseShare> shares = entry.getValue();

            UUID payerId = tx.getUser().getId();

            BigDecimal totalOwedByOthersAndSelf = shares.stream()
                    .map(PodExpenseShare::getOwedAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            netBalances.put(payerId, netBalances.getOrDefault(payerId, BigDecimal.ZERO).add(totalOwedByOthersAndSelf));

            for (PodExpenseShare share : shares) {
                UUID debtorId = share.getUser().getId();
                netBalances.put(debtorId, netBalances.getOrDefault(debtorId, BigDecimal.ZERO).subtract(share.getOwedAmount()));
            }
        }

        return debtMinimizationService.minimizeDebt(netBalances);
    }

    @Transactional(readOnly = true)
    public List<com.finflow.backend.dto.PodDto> getUserPods(UUID userId) {
        return podMemberRepository.findByUserId(userId).stream()
                .map(pm -> {
                    Pod pod = pm.getPod();
                    List<com.finflow.backend.dto.PodDto.PodMemberDto> memberDtos = podMemberRepository.findByPodId(pod.getId()).stream()
                            .map(m -> com.finflow.backend.dto.PodDto.PodMemberDto.builder()
                                    .userId(m.getUser() != null ? m.getUser().getId() : null)
                                    .email(m.getUser() != null ? m.getUser().getEmail() : m.getPendingEmail())
                                    .firstName(m.getUser() != null ? m.getUser().getFirstName() : null)
                                    .lastName(m.getUser() != null ? m.getUser().getLastName() : null)
                                    .pendingEmail(m.getPendingEmail())
                                    .build())
                            .toList();
                    return com.finflow.backend.dto.PodDto.builder()
                            .id(pod.getId())
                            .name(pod.getName())
                            .createdAt(pod.getCreatedAt())
                            .members(memberDtos)
                            .build();
                })
                .toList();
    }

    @Transactional
    public void settleUp(UUID podId) {
        if (!podRepository.existsById(podId)) {
            throw new RuntimeException("Pod not found");
        }
        
        List<PodExpenseShare> unsettledShares = podExpenseShareRepository.findByPodIdAndSettledFalse(podId);
        for (PodExpenseShare share : unsettledShares) {
            share.setSettled(true);
            podExpenseShareRepository.save(share);
        }
    }
}
