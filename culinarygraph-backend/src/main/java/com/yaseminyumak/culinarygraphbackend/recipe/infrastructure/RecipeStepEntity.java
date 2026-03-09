package com.yaseminyumak.culinarygraphbackend.recipe.infrastructure;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "recipe_steps")
public class RecipeStepEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "recipe_id", nullable = false)
	private RecipeEntity recipe;

	@Column(name = "step_order", nullable = false)
	private int stepOrder;

	@Column(name = "instruction", nullable = false, columnDefinition = "TEXT")
	private String instruction;

	@SuppressWarnings("unused")
	protected RecipeStepEntity() {
	}

	public RecipeStepEntity(RecipeEntity recipe, int stepOrder, String instruction) {
		this.recipe = recipe;
		this.stepOrder = stepOrder;
		this.instruction = instruction;
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

	public int getStepOrder() {
		return stepOrder;
	}

	public void setStepOrder(int stepOrder) {
		this.stepOrder = stepOrder;
	}

	public String getInstruction() {
		return instruction;
	}

	public void setInstruction(String instruction) {
		this.instruction = instruction;
	}
}
