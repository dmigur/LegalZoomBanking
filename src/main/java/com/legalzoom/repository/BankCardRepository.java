package com.legalzoom.repository;

import com.legalzoom.entity.BankCard;
import com.legalzoom.exceptions.CardAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * Created by dmitrigu on 5/25/2019.
 */
@Repository
public class BankCardRepository implements IBankCardRepository {

    private static Logger logger = LoggerFactory.getLogger(BankCardRepository.class);

    public void add(BankCard card) throws Exception {

        if (cards.stream().anyMatch(el -> el.getCardNumber().equals(card.getCardNumber()))) {
            throw new CardAlreadyExistsException("Card " + card.getCardNumber() + "  already exists");
        }
        cards.add(card);

    }

    public Collection<BankCard> getCards(int offset, int limit) {

        List<BankCard> sorted = cards.stream().sorted(Comparator.comparing(BankCard::getExpiryDate).reversed())
                .collect(Collectors.toList());

        if (CollectionUtils.isEmpty(sorted)) {
            return sorted;

        }
        if (offset >= sorted.size()) {
            return new ArrayList<BankCard>();
        }

        List<BankCard> sublist = null;

        if (limit == -1) {
            sublist = sorted.subList(offset, sorted.size());
        } else {
            sublist = sorted.subList(offset, Math.min(sorted.size(), offset + limit));
        }

        return sublist;

    }

    private List<BankCard> cards = new CopyOnWriteArrayList<BankCard>();

}