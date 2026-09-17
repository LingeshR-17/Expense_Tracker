package com.finflow.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    private String code;
    private String message;
    private Map<String, String> details;

    public ApiError(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
