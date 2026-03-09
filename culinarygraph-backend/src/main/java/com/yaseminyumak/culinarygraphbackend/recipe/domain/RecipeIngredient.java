package com.yaseminyumak.culinarygraphbackend.recipe.domain;

import java.util.Objects;

/**
 * Recipe ingredient — value object (immutable). MVP uses free text; may be linked to catalog Ingredient later.
 */
public final class RecipeIngredient {

	private final String name;
	private final String quantity;
	private final String unit;

	public RecipeIngredient(String name, String quantity, String unit) {
		this.name = Objects.requireNonNull(name, "name cannot be null");
		this.quantity = quantity != null ? quantity : "";
		this.unit = unit != null ? unit : "";
	}

	public String getName() {
		return name;
	}

	public String getQuantity() {
		return quantity;
	}

	public String getUnit() {
		return unit;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		RecipeIngredient that = (RecipeIngredient) o;
		return Objects.equals(name, that.name) && Objects.equals(quantity, that.quantity) && Objects.equals(unit, that.unit);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, quantity, unit);
	}
}
