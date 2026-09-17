package com.finflow.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CategoryDto {
    private UUID id;
    private String name;
    private String icon;
    private String color;
    private Boolean isCustom;
}
