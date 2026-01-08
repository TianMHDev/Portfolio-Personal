package com.sebastian.portfolio.domain.model;

import java.util.List;

public class Project {
    private Long id;
    private String title;
    private String description;
    private List<String> technologies;
    private String problem;
    private String learning;
    private List<String> features;
    private String architecture;
    private String githubUrl;
    private String demoUrl;
    private List<String> imageUrls;
    private String version;

    public Project() {
    }

    public Project(Long id, String title, String description, List<String> technologies, String problem,
            String learning, List<String> features, String architecture, String githubUrl, String demoUrl,
            List<String> imageUrls, String version) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.technologies = technologies;
        this.problem = problem;
        this.learning = learning;
        this.features = features;
        this.architecture = architecture;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.imageUrls = imageUrls;
        this.version = version;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTechnologies() {
        return technologies;
    }

    public void setTechnologies(List<String> technologies) {
        this.technologies = technologies;
    }

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getLearning() {
        return learning;
    }

    public void setLearning(String learning) {
        this.learning = learning;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public String getArchitecture() {
        return architecture;
    }

    public void setArchitecture(String architecture) {
        this.architecture = architecture;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
