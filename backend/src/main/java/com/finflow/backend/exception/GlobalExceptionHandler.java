package com.finflow.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiError apiError = new ApiError("VALIDATION_ERROR", "Validation failed", errors);
        return new ResponseEntity<>(new ErrorResponse(apiError), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ApiError apiError = new ApiError("REQUEST_ERROR", ex.getReason());
        return new ResponseEntity<>(new ErrorResponse(apiError), ex.getStatusCode());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNoSuchElementException(NoSuchElementException ex) {
        ApiError apiError = new ApiError("NOT_FOUND", ex.getMessage() != null ? ex.getMessage() : "Resource not found");
        return new ResponseEntity<>(new ErrorResponse(apiError), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        ApiError apiError = new ApiError("UNAUTHORIZED", "Authentication failed");
        return new ResponseEntity<>(new ErrorResponse(apiError), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ApiError apiError = new ApiError("FORBIDDEN", "Access denied");
        return new ResponseEntity<>(new ErrorResponse(apiError), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ApiError apiError = new ApiError("INTERNAL_SERVER_ERROR", "An unexpected error occurred");
        // Print stack trace in server logs, but don't expose to client
        ex.printStackTrace();
        return new ResponseEntity<>(new ErrorResponse(apiError), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
