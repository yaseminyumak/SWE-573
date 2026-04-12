package com.yaseminyumak.culinarygraphbackend.catalog.domain;

import java.util.Objects;

/**
 * Technique step — value object (immutable).
 */
public final class TechniqueStep {

	private final int order;
	private final String instruction;

	public TechniqueStep(int order, String instruction) {
		this.order = order;
		this.instruction = Objects.requireNonNull(instruction, "instruction cannot be null");
	}

	public int getOrder() { return order; }
	public String getInstruction() { return instruction; }

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		TechniqueStep that = (TechniqueStep) o;
		return order == that.order && Objects.equals(instruction, that.instruction);
	}

	@Override
	public int hashCode() {
		return Objects.hash(order, instruction);
	}
}
