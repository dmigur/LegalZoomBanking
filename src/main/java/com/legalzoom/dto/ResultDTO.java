package com.legalzoom.dto;

import com.legalzoom.enums.ErrorCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;

/**
 * Created by dmitrigu on 5/25/2019.
 */

@Setter
@Getter
public class ResultDTO {
    private ErrorCode status;
    private String message;
    private Collection<BankCardDTO> data;
}