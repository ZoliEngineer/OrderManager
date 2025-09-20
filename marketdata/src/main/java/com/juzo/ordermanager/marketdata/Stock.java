package com.juzo.ordermanager.marketdata;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Stocks")
public record Stock(
        @Id String id,
        String ticker,
        String name,
        double price
) { }