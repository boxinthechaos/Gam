package org.example.gam.Repository;
import org.example.gam.entitiy.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    Optional<RefreshToken> findByEmail(String email);
    Optional<RefreshToken> findByToken(String Token);
    Optional<RefreshToken> deleteByEmail(String email);
}
