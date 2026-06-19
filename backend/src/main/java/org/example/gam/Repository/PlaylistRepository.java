package org.example.gam.Repository;

import org.example.gam.entitiy.Playlist;
import org.example.gam.entitiy.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUser(User user);
}
