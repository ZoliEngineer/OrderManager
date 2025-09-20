package com.juzo.ordermanager.marketdata;

import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.kafka.support.SendResult;

@Service
public class MessageProducer {

  private static final Logger logger = LoggerFactory.getLogger(MessageProducer.class);
  private static final String TOPIC = "Order_Stream";

  @Autowired
  private KafkaTemplate<Object, Object> kafkaTemplate;

  public void sendMessage(String key, String value) {
    CompletableFuture<SendResult<Object, Object>> future = kafkaTemplate.send(TOPIC, key, value);
    future.whenComplete((result, ex) -> {
        if (ex == null) {
            logger.info(String.format(
                "\n\n Produced event to topic %s: key = %-10s value = %s \n\n",
                TOPIC, key, value
            ));
        } else {
            logger.error("Failed to send message", ex);
        }
    });    
    
   
  }
}