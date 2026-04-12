package com.yaseminyumak.culinarygraphbackend.recipe.infrastructure;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "recipe_ingredients")
public class RecipeIngredientEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "recipe_id", nullable = false)
	private RecipeEntity recipe;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "quantity", length = 100)
	private String quantity;

	@Column(name = "unit", length = 100)
	private String unit;

	@Column(name = "ingredient_id")
	private UUID ingredientId;

	@SuppressWarnings("unused")
	protected RecipeIngredientEntity() {
	}

	public RecipeIngredientEntity(RecipeEntity recipe, String name, String quantity, String unit, UUID ingredientId) {
		this.recipe = recipe;
		this.name = name;
		this.quantity = quantity != null ? quantity : "";
		this.unit = unit != null ? unit : "";
		this.ingredientId = ingredientId;
	}

	public UUID getId() {
		return id;
	}

	public RecipeEntity getRecipe() {
		return recipe;
	}

	public void setRecipe(RecipeEntity recipe) {
		this.recipe = recipe;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public UUID getIngredientId() {
		return ingredientId;
	}

	public void setIngredientId(UUID ingredientId) {
		this.ingredientId = ingredientId;
	}
}
