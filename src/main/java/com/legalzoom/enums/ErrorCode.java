package com.legalzoom.enums;

/**
 * Created by dmitrigu on 5/25/2019.
 */
public enum ErrorCode {
    Success(0),
    Error(1);
    ErrorCode(int cod){
        code = cod;
    }
    private int code;
}