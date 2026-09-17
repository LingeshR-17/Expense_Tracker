package com.finflow.backend.controller;

import com.finflow.backend.dto.SettlementTransaction;
import com.finflow.backend.entity.Pod;
import com.finflow.backend.security.UserPrincipal;
import com.finflow.backend.service.PodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pods")
@RequiredArgsConstructor
public class PodController {

    private final PodService podService;

    @GetMapping
    public ResponseEntity<List<com.finflow.backend.dto.PodDto>> getUserPods(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(podService.getUserPods(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<Pod> createPod(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody java.util.Map<String, String> request) {
        Pod pod = podService.createPod(request.get("name"), userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(pod);
    }

    @PostMapping("/{podId}/invite")
    public ResponseEntity<Void> inviteMember(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable UUID podId, @RequestBody java.util.Map<String, String> request) {
        podService.inviteMember(podId, request.get("email"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{podId}/settlement-plan")
    public ResponseEntity<List<SettlementTransaction>> getSettlementPlan(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable UUID podId) {
        return ResponseEntity.ok(podService.getSettlementPlan(podId));
    }

    @PostMapping("/{podId}/settle")
    public ResponseEntity<Void> settleUp(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable UUID podId) {
        podService.settleUp(podId);
        return ResponseEntity.ok().build();
    }
}
