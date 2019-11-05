package com.legalzoom.service;

import com.legalzoom.entity.BankCard;

import java.util.Collection;

/**
 * Created by dmitrigu on 5/25/2019.
 */
public interface IBankCardService {

    public void add(BankCard card) throws Exception;

    public Collection<BankCard> getCards(Integer offset, Integer limit);

}
