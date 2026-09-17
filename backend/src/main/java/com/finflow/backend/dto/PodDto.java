package com.finflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PodDto {
    private UUID id;
    private String name;
    private LocalDateTime createdAt;
    private List<PodMemberDto> members;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PodMemberDto {
        private UUID userId;
        private String email;
        private String firstName;
        private String lastName;
        private String pendingEmail;
    }
}
