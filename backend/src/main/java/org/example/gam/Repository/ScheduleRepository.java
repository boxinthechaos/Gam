package org.example.gam.Repository;

import org.example.gam.entitiy.Schedule;
import org.example.gam.entitiy.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.gam.entitiy.User;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByTripOrderByVisitDateAscStartTimeAsc(Trip trip);
}
