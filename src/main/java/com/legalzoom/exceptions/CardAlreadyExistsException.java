package com.legalzoom.exceptions;

/**
 * Created by dmitrigu on 5/26/2019.
 */
public class CardAlreadyExistsException extends Exception {

    public CardAlreadyExistsException(String s){
        super(s);
    }
}