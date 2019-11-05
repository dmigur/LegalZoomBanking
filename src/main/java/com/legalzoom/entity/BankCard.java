package com.legalzoom.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.Calendar;

/**
 * Created by dmitrigu on 5/25/2019.
 */
@Setter
@Getter
public class BankCard {
    private String bankName;
    private String cardNumber;
    private Calendar expiryDate;

    public BankCard(String bankName, String cardNumber, Calendar expiryDate) {
        this.bankName = bankName;
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
    }

    @Override
    public String toString() {
        return "BankCard{" +
                "cardNumber='" + cardNumber + '\'' +
                '}';
    }
}