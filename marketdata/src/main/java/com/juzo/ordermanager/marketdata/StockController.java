package com.juzo.ordermanager.marketdata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
public class StockController {

	@Autowired
	private StockRepository stockRepository;
	
	@Autowired
	private MessageProducer messageProducer;

	@GetMapping("/stocks")
	public List<Stock> getAllStocks() {
		return stockRepository.findAll(); 
	}
	
	@PostMapping("/buy")
	public void buyStock(@RequestBody StockPurchase purchase) {
		System.out.println("Bought " + purchase.ticker() + " " + purchase.quantity() ); 
		messageProducer.sendMessage(purchase.ticker(), purchase.ticker() + " " + purchase.quantity());
	}
}