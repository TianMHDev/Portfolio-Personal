package com.sebastian.portfolio.infrastructure.persistence.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "portfolio_profile")
public class ProfileEntity extends PanacheEntityBase {
    @Id
    public Long id;

    @Column(nullable = false)
    public String name;

    public String role;
    public String manifesto;
    public String location;
    public String status;

    @Column(columnDefinition = "TEXT")
    public String aboutTitle;

    @Column(columnDefinition = "TEXT")
    public String aboutDescription;

    public String englishLevel;
    public String currentlyLearning;
    public String profileImage;
}
