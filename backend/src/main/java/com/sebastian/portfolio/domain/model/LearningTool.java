package com.sebastian.portfolio.domain.model;

public class LearningTool {
    private Long id;
    private String name;
    private String category; // e.g., Backend, Frontend, Cloud
    private String status; // e.g., LEARNING, MASTERED
    private Integer progress; // 0-100

    public LearningTool() {
    }

    public LearningTool(Long id, String name, String category, String status, Integer progress) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.status = status;
        this.progress = progress;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }
}
