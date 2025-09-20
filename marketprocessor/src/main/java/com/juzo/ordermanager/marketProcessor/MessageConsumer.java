package com.juzo.ordermanager.marketProcessor;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Service
public class MessageConsumer {

	private static final Logger logger = LoggerFactory.getLogger(MessageConsumer.class);
	private static final String TOPIC = "Order_Stream";

	@KafkaListener(id = "myConsumer", topics = TOPIC, groupId = "my-group", autoStartup = "true")
	public void listen(ConsumerRecord<String, String> record, Acknowledgment ack) {
		logger.info("Received message: key={}, value={}, partition={}, offset={}", record.key(), record.value(),
				record.partition(), record.offset());
		ack.acknowledge();

	}
}