package com.legalzoom.service;

import com.legalzoom.entity.BankCard;
import com.legalzoom.repository.BankCardRepository;
import com.legalzoom.util.Settings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by dmitrigu on 5/25/2019.
 */


@Service
public class BankCardService implements IBankCardService {


    @Autowired
    private BankCardRepository repository;

    @Autowired
    private Settings settings;

    private static Logger logger = LoggerFactory.getLogger(BankCardService.class);

    public void add(BankCard card) throws Exception {
        logger.info("Adding card to REPO");
        repository.add(card);
    }

    public Collection<BankCard> getCards(Integer offset, Integer limit) {

        return repository.getCards(offset, limit);

    }

    public Collection<BankCard> processCSV(InputStream stream) throws Exception {

        Collection<BankCard> cards = parseCSV(stream);
        logger.info("Overall " + cards.size() + " cards incoming");
        Collection<BankCard> processed = new ArrayList<BankCard>();

        for (BankCard card : cards) {
            try {
                repository.add(card);
                processed.add(card);
            } catch (Exception ex) {
                logger.error("Error adding card ", ex);
            }
        }
        return processed;
    }

    protected Collection<BankCard> parseCSV(InputStream stream) throws Exception {

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        String line;
        List<BankCard> processed = new ArrayList<BankCard>();

        try {
            while ((line = reader.readLine()) != null) {
                BankCard card = null;
                try {
                    card = parseBankCard(line);
                } catch (Exception e) {
                    logger.info("Error processing line " + line + ", SKIPPES!");
                    continue;
                }
                processed.add(card);
                logger.info("*** Card " + card + " PROCESSED!");

            }
        } catch (Exception e) {

            logger.error("Error processing CSV file", e);
            throw new Exception("Error processing CSV file", e);

        }

        return processed;

    }

    public BankCard parseBankCard(String line) throws Exception {
        String[] data = line.split("[,;]");
        return parseBankCard(data);
    }


    public BankCard parseBankCard(String[] data) throws Exception {

        if (data.length < 3) {
            return null;
        }
        if (!data[0].matches(settings.getBankNamePattern())) {
            return null;
        }
        if (!data[1].matches(settings.getCardNumberPattern())) {
            return null;
        }
        Calendar expires = GregorianCalendar.getInstance();
        if (!data[2].matches(settings.getExpiresPattern())) {
            return null;
        }
        try {
            expires.setTime(new SimpleDateFormat("dd-MM-yyyy").parse(data[2]));
        } catch (Exception e) {
            throw e;
        }

        return new BankCard(data[0], data[1], expires);
    }
}