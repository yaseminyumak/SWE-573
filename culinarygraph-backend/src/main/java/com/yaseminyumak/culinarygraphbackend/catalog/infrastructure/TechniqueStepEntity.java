package com.yaseminyumak.culinarygraphbackend.catalog.infrastructure;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "technique_steps")
public class TechniqueStepEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "technique_id", nullable = false)
	private TechniqueEntity technique;

	@Column(name = "step_order", nullable = false)
	private int stepOrder;

	@Column(name = "instruction", columnDefinition = "TEXT", nullable = false)
	private String instruction;

	@SuppressWarnings("unused")
	protected TechniqueStepEntity() {}

	public TechniqueStepEntity(TechniqueEntity technique, int stepOrder, String instruction) {
		this.technique = technique;
		this.stepOrder = stepOrder;
		this.instruction = instruction;
	}

	public UUID getId() { return id; }
	public TechniqueEntity getTechnique() { return technique; }
	public void setTechnique(TechniqueEntity technique) { this.technique = technique; }
	public int getStepOrder() { return stepOrder; }
	public void setStepOrder(int stepOrder) { this.stepOrder = stepOrder; }
	public String getInstruction() { return instruction; }
	public void setInstruction(String instruction) { this.instruction = instruction; }
}
