# Spring Boot Best Practices in 2025

*December 6, 2025*

---

## Introduction

Spring Boot has evolved significantly over the years. With Spring Boot 3.x and Java 21, we have access to powerful features that make building production-ready applications easier than ever. Here are my battle-tested best practices for 2025.

## 1. Project Structure

Organize your code by feature, not by layer:

```
// ❌ Don't do this (layer-based)
src/main/java/com/example/
├── controllers/
│   ├── UserController.java
│   ├── OrderController.java
│   └── ProductController.java
├── services/
│   ├── UserService.java
│   └── OrderService.java
└── repositories/
    └── ...

// ✅ Do this (feature-based)
src/main/java/com/example/
├── user/
│   ├── UserController.java
│   ├── UserService.java
│   ├── UserRepository.java
│   └── User.java
├── order/
│   ├── OrderController.java
│   ├── OrderService.java
│   └── Order.java
└── shared/
    └── ...
```

Feature-based packaging improves cohesion and makes it easier to navigate large codebases.

## 2. Use Records for DTOs

Java records are perfect for Data Transfer Objects:

```java
// ✅ Clean and immutable
public record UserResponse(
    Long id,
    String name,
    String email,
    LocalDateTime createdAt
) {}

public record CreateUserRequest(
    @NotBlank String name,
    @Email String email,
    @Size(min = 8) String password
) {}
```

No more Lombok boilerplate for simple data carriers!

## 3. Constructor Injection

Always prefer constructor injection over field injection:

```java
// ❌ Field injection
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}

// ✅ Constructor injection
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}
```

Constructor injection makes dependencies explicit and testing easier.

## 4. Configuration Properties

Use `@ConfigurationProperties` for type-safe configuration:

```java
@Configuration
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(
    String host,
    int port,
    String username,
    String password,
    boolean sslEnabled
) {}
```

```yaml
# application.yml
app:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USER}
    password: ${MAIL_PASS}
    ssl-enabled: true
```

## 5. Global Exception Handling

Centralize your exception handling:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            EntityNotFoundException ex) {
        return ResponseEntity.status(NOT_FOUND)
            .body(new ErrorResponse(
                NOT_FOUND.value(),
                ex.getMessage(),
                Instant.now()
            ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();
            
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(
                BAD_REQUEST.value(),
                "Validation failed",
                errors,
                Instant.now()
            ));
    }
}
```

## 6. Use Spring Data Projections

Don't fetch entire entities when you only need a few fields:

```java
// ✅ Interface projection
public interface UserSummary {
    Long getId();
    String getName();
    String getEmail();
}

public interface UserRepository extends JpaRepository<User, Long> {
    List<UserSummary> findAllProjectedBy();
    
    @Query("SELECT u.id as id, u.name as name FROM User u")
    List<UserSummary> findAllSummaries();
}
```

## 7. Virtual Threads (Java 21+)

Enable virtual threads for better concurrency:

```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true
```

```java
// Your blocking code now scales better!
@GetMapping("/{id}")
public User getUser(@PathVariable Long id) {
    // This can now handle thousands of concurrent requests
    return userService.findById(id);
}
```

## 8. Testcontainers for Integration Tests

Use real databases in tests:

```java
@SpringBootTest
@Testcontainers
class UserServiceIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = 
        new PostgreSQLContainer<>("postgres:16");

    @Autowired
    private UserService userService;

    @Test
    void shouldCreateUser() {
        var request = new CreateUserRequest(
            "John", "john@example.com", "password123"
        );
        
        var user = userService.create(request);
        
        assertThat(user.id()).isNotNull();
        assertThat(user.name()).isEqualTo("John");
    }
}
```

## 9. Observability with Micrometer

Add proper observability:

```java
@RestController
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    private final MeterRegistry registry;

    @GetMapping("/users/{id}")
    @Observed(name = "user.fetch", contextualName = "fetch-user")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  tracing:
    sampling:
      probability: 1.0
```

## 10. Security Best Practices

Modern Spring Security configuration:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) 
            throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> 
                oauth2.jwt(Customizer.withDefaults()))
            .build();
    }
}
```

## Bonus: Project Checklist

Before deploying to production, ensure you have:

- [ ] Health checks configured
- [ ] Structured logging (JSON)
- [ ] Metrics endpoint exposed
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Rate limiting
- [ ] Proper error responses
- [ ] Database migrations (Flyway/Liquibase)
- [ ] Security headers
- [ ] CORS configuration
- [ ] Request validation

## Conclusion

Spring Boot in 2025 is more powerful than ever. These practices will help you build maintainable, scalable, and production-ready applications.

*Keep learning, keep building.* ☾

---

**Tags:** `#java` `#springboot` `#backend` `#bestpractices` `#java21`

