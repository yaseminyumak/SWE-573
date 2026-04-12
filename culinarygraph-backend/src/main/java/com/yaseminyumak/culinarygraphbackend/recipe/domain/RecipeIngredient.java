package com.yaseminyumak.culinarygraphbackend.recipe.domain;

import java.util.Objects;
import java.util.UUID;

/**
 * Recipe ingredient — value object (immutable). May be optionally linked to a catalog Ingredient via ingredientId.
 */
public final class RecipeIngredient {

	private final String name;
	private final String quantity;
	private final String unit;
	private final UUID ingredientId;

	public RecipeIngredient(String name, String quantity, String unit, UUID ingredientId) {
		this.name = Objects.requireNonNull(name, "name cannot be null");
		this.quantity = quantity != null ? quantity : "";
		this.unit = unit != null ? unit : "";
		this.ingredientId = ingredientId;
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

	public UUID getIngredientId() {
		return ingredientId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		RecipeIngredient that = (RecipeIngredient) o;
		return Objects.equals(name, that.name) && Objects.equals(quantity, that.quantity)
			&& Objects.equals(unit, that.unit) && Objects.equals(ingredientId, that.ingredientId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, quantity, unit, ingredientId);
	}
}
