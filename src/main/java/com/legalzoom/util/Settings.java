package com.legalzoom.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by dmitrigu on 5/26/2019.
 */
@Setter
@Getter
@Service("Settings")
public class Settings {

    @Value("${card.bank.name.pattern}")
    private String bankNamePattern;
    @Value("${card.number.pattern}")
    private String cardNumberPattern;
    @Value("${card.expires.pattern}")
    private String expiresPattern;
    @Value("${ui.cards.load.limit}")
    private Integer limit;
    @Value("${server.csv.file.maxsize}")
    private Integer maxFileSize;


}