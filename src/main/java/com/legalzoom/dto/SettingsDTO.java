package com.legalzoom.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by dmitrigu on 5/26/2019.
 */
@Setter
@Getter
public class SettingsDTO {

    private String bankNamePattern;
    private String cardNumberPattern;
    private String expiresPattern;
    private int maxFileSize;

}