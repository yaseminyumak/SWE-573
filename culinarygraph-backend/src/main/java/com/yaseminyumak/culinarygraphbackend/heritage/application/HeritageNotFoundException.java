package com.yaseminyumak.culinarygraphbackend.heritage.application;

import java.util.UUID;

public class HeritageNotFoundException extends RuntimeException {
	public HeritageNotFoundException(UUID id) {
		super("Heritage not found: " + id);
	}
}
