package com.legalzoom.repository;

import com.legalzoom.entity.BankCard;

import java.util.Collection;

/**
 * Created by dmitrigu on 5/25/2019.
 */
public interface IBankCardRepository {

    public void add(BankCard card) throws Exception;

    public Collection<BankCard> getCards(int offset, int limit);

}
