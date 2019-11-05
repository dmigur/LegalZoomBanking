package com.legalzoom.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Calendar;

/**
 * Created by dmitrigu on 5/25/2019.
 */
@Setter
@Getter
public class BankCardDTO {
    @JsonProperty("bankName")
    private String bankName;

    @JsonProperty("cardNumber")
    private String cardNumber;

    @JsonProperty("expires")
    private Calendar expires;
}