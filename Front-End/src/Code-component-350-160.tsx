# 🔗 GUÍA COMPLETA DE INTEGRACIÓN BACKEND - FRONTEND

## 📋 **ÍNDICE DE CONTENIDOS**

1. [Estado Actual del Proyecto](#estado-actual)
2. [Flujos Principales Identificados](#flujos-principales)
3. [Configuración Inicial](#configuración-inicial)
4. [Integración por Componentes](#integración-por-componentes)
5. [Estructuras de Datos](#estructuras-de-datos)
6. [Checklist de Integración](#checklist-de-integración)
7. [Testing y Depuración](#testing-y-depuración)

---

## 🎯 **ESTADO ACTUAL DEL PROYECTO**

### ✅ **Lo que YA está listo:**
- ✅ Todas las vistas UI funcionando con datos mock
- ✅ Sistema de navegación completo
- ✅ Gestión de estado global en App.tsx
- ✅ Servicios API definidos en `/services/api.js`
- ✅ Sistema de autenticación frontend
- ✅ Componentes UI completamente funcionales
- ✅ Sistema de precios centralizado
- ✅ Responsive design completo

### 🔧 **Lo que falta por conectar:**
- 🔧 Conexión real con endpoints del backend
- 🔧 Manejo de errores de red
- 🔧 Estados de carga (loading)
- 🔧 Persistencia de datos
- 🔧 Autenticación JWT real

---

## 🚀 **FLUJOS PRINCIPALES IDENTIFICADOS**

### 1. **FLUJO DE AUTENTICACIÓN**
```
Landing → Login/Register → Email Verification → Dashboard
```
**Componentes:** `Login.tsx`, `Register.tsx`, `EmailVerification.tsx`

### 2. **FLUJO DE BÚSQUEDA Y RESERVA**
```
Dashboard → SearchSitters → BookingModal → PaymentGateway → BookingManager
```
**Componentes:** `SearchSitters.tsx`, `BookingModal.tsx`, `PaymentGateway.tsx`

### 3. **FLUJO DE GESTIÓN DE PERFIL**
```
Dashboard → ProfileManager → SitterProfileForm/OwnerPetsForm
```
**Componentes:** `ProfileManager.tsx`, `SitterProfileForm.tsx`, `OwnerPetsForm.tsx`

### 4. **FLUJO ADMINISTRATIVO**
```
AdminDashboard → UserManagement/ServicePricingManager/AllReports
```
**Componentes:** `AdminDashboard.tsx`, `UserManagement.tsx`, `ServicePricingManager.tsx`

---

## ⚙️ **CONFIGURACIÓN INICIAL**

### 1. **Variables de Entorno**
Crear archivo `.env` en la raíz del proyecto:
```bash
# Backend Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development

# Optional: Upload Configuration
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### 2. **Configuración CORS en Spring Boot**
```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 3. **Configuración de Seguridad JWT**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/services").permitAll()
                .requestMatchers("/api/sitters/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/sitters/{id}").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

---

## 🔧 **INTEGRACIÓN POR COMPONENTES**

### 1. **AUTENTICACIÓN - Login.tsx**

#### **Paso 1: Importar el servicio API**
```javascript
// En /components/Login.tsx - línea 2
import { authAPI } from "../services/api.js"
```

#### **Paso 2: Modificar la función handleSubmit**
```javascript
// Buscar la función handleSubmit en Login.tsx (aprox. línea 25)
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    // REEMPLAZAR esta línea:
    // setTimeout(() => {
    //   onLogin(selectedUserType, userData)
    //   setIsLoading(false)
    // }, 1000)

    // CON esta llamada real al API:
    const response = await authAPI.login(formData.email, formData.password, selectedUserType)
    
    // El token se guarda automáticamente en localStorage por la función login
    onLogin(selectedUserType, response.user)
    
  } catch (error) {
    setError(error.message || "Error al iniciar sesión")
  } finally {
    setIsLoading(false)
  }
}
```

#### **Paso 3: Endpoint Spring Boot requerido**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Validar credenciales
        User user = authService.authenticate(request.getEmail(), request.getPassword(), request.getUserType());
        
        // Generar JWT token
        String token = jwtService.generateToken(user);
        
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(UserDTO.fromEntity(user));
        
        return ResponseEntity.ok(response);
    }
}
```

#### **Paso 4: Estructura de datos esperada**
```java
// LoginRequest.java
public class LoginRequest {
    private String email;
    private String password;
    private String userType; // "owner", "sitter", "admin"
    // getters y setters
}

// LoginResponse.java
public class LoginResponse {
    private String token;
    private UserDTO user;
    // getters y setters
}

// UserDTO.java
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String userType;
    private String identificationType;
    private String identificationNumber;
    private List<PetDTO> pets; // Solo para owners
    // getters y setters
}
```

---

### 2. **REGISTRO - Register.tsx**

#### **Paso 1: Importar servicios**
```javascript
// En /components/Register.tsx
import { authAPI } from "../services/api.js"
```

#### **Paso 2: Modificar función handleSubmit**
```javascript
// Buscar handleSubmit en Register.tsx
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    // REEMPLAZAR la lógica existente CON:
    const userData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      userType: userType,
      identificationType: formData.identificationType,  
      identificationNumber: formData.identificationNumber,
      pets: userType === 'owner' ? pets : undefined
    }

    const response = await authAPI.register(userData)
    
    // Si el registro requiere verificación de email
    if (response.requiresEmailVerification) {
      onEmailVerification(formData.email)
    } else {
      // Login automático después del registro
      onRegister(userType, response.user)
    }

  } catch (error) {
    setError(error.message || "Error en el registro")
  } finally {
    setIsLoading(false)
  }
}
```

#### **Paso 3: Endpoint Spring Boot**
```java
@PostMapping("/register")
public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
    // Validar datos
    if (userService.existsByEmail(request.getEmail())) {
        throw new BadRequestException("El email ya está registrado");
    }
    
    // Crear usuario
    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setName(request.getName());
    user.setUserType(UserType.valueOf(request.getUserType().toUpperCase()));
    user.setIdentificationType(request.getIdentificationType());
    user.setIdentificationNumber(request.getIdentificationNumber());
    
    // Guardar mascotas si es owner
    if ("owner".equals(request.getUserType()) && request.getPets() != null) {
        List<Pet> pets = request.getPets().stream()
            .map(petDto -> {
                Pet pet = new Pet();
                pet.setName(petDto.getName());
                pet.setType(petDto.getType());
                pet.setBreed(petDto.getBreed());
                pet.setAge(petDto.getAge());
                pet.setImage(petDto.getImage());
                pet.setOwner(user);
                return pet;
            })
            .collect(Collectors.toList());
        user.setPets(pets);
    }
    
    User savedUser = userService.save(user);
    
    // Enviar email de verificación
    emailService.sendVerificationEmail(savedUser);
    
    RegisterResponse response = new RegisterResponse();
    response.setMessage("Registro exitoso. Verifica tu email.");
    response.setRequiresEmailVerification(true);
    response.setUser(UserDTO.fromEntity(savedUser));
    
    return ResponseEntity.ok(response);
}
```

---

### 3. **BÚSQUEDA DE CUIDADORES - SearchSitters.tsx**

#### **Paso 1: Modificar la función de búsqueda**
```javascript
// En /components/SearchSitters.tsx
import { sitterAPI } from "../services/servicesPricing.js"

// Buscar donde se definen los cuidadores (aprox. línea 100)
// REEMPLAZAR const sitters = [...] CON:

const [sitters, setSitters] = useState([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState("")

// Agregar función para cargar cuidadores
const loadSitters = async (searchParams = {}) => {
  setIsLoading(true)
  setError("")
  
  try {
    const params = {
      location: searchLocation,
      services: selectedServices.join(','),
      minRating: minRating !== "0" ? minRating : undefined,
      availability: availability !== "any" ? availability : undefined,
      date: selectedDate || undefined,
      timeSlot: timeSlot !== "any" ? timeSlot : undefined,
      ...searchParams
    }

    // Filtrar parámetros vacíos
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })

    const response = await sitterAPI.searchSitters(params)
    setSitters(response.content || response) // Dependiendo de si Spring usa paginación
    
  } catch (error) {
    setError(error.message || "Error al cargar cuidadores")
    setSitters([]) // Fallback a lista vacía
  } finally {
    setIsLoading(false)
  }
}

// Ejecutar búsqueda al cargar el componente
useEffect(() => {
  loadSitters()
}, []) // Cargar cuidadores al montar el componente

// Ejecutar búsqueda cuando cambien los filtros
const handleSearch = () => {
  loadSitters()
}
```

#### **Paso 2: Actualizar el botón de búsqueda**
```javascript
// Buscar el botón "Buscar" y cambiar onClick
<Button className="flex-1 sm:flex-none" onClick={handleSearch}>
  <Search className="h-4 w-4 mr-2" />
  Buscar
</Button>
```

#### **Paso 3: Agregar estados de carga y error**
```javascript
// Agregar esto antes del mapeo de cuidadores
{isLoading && (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    <p className="text-gray-600 mt-4">Buscando cuidadores...</p>
  </div>
)}

{error && (
  <div className="text-center py-8">
    <p className="text-red-600">{error}</p>
    <Button onClick={loadSitters} variant="outline" className="mt-4">
      Reintentar
    </Button>
  </div>
)}

{!isLoading && !error && sitters.length === 0 && (
  <div className="text-center py-8 text-gray-500">
    <p>No se encontraron cuidadores con los filtros aplicados</p>
  </div>
)}
```

#### **Paso 4: Endpoint Spring Boot**
```java
@RestController
@RequestMapping("/api/sitters")
public class SitterController {
    
    @GetMapping("/search")
    public ResponseEntity<Page<SitterDTO>> searchSitters(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String services,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String timeSlot,
            Pageable pageable) {
        
        SitterSearchCriteria criteria = SitterSearchCriteria.builder()
            .location(location)
            .services(services != null ? Arrays.asList(services.split(",")) : null)
            .minRating(minRating)
            .availability(availability)
            .date(date)
            .timeSlot(timeSlot)
            .build();
            
        Page<Sitter> sitters = sitterService.searchSitters(criteria, pageable);
        Page<SitterDTO> sitterDTOs = sitters.map(SitterDTO::fromEntity);
        
        return ResponseEntity.ok(sitterDTOs);
    }
}
```

---

### 4. **RESERVAS - BookingModal.tsx**

#### **Paso 1: Modificar handleSubmit**
```javascript
// En /components/BookingModal.tsx
import { bookingAPI } from "../services/api.js"

// Buscar la función handleSubmit (aprox. línea 290)
const handleSubmit = async () => {
  if (!isAuthenticated) {
    onLoginRequired?.()
    return
  }

  if (!selectedPets.length || !selectedDate || (isHourlyService && (!startTime || !endTime))) {
    return
  }

  if (isHourlyService && !isValidTimeRange()) {
    return
  }

  setIsProcessing(true)

  try {
    const selectedPetObjects = selectedPets.map(petId => 
      allPets.find(p => p.id === petId)
    ).filter(Boolean) as Pet[]

    const bookingData = {
      sitterId: selectedSitter?.id,
      service: serviceType,
      pets: selectedPetObjects.map(pet => ({
        id: pet.id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        specialNeeds: pet.specialNeeds
      })),
      date: selectedDate,
      startTime: isHourlyService ? startTime : null,
      endTime: isHourlyService ? endTime : null,
      duration: timeUnit,
      serviceUnit: selectedServiceType?.unit,
      price: totalPrice,
      specialRequests,
      emergencyContact
    }

    // REEMPLAZAR la lógica existente CON:
    const response = await bookingAPI.createBooking(bookingData)
    
    // Ir directamente a la pasarela de pagos con la reserva creada
    if (onProceedToPayment) {
      onProceedToPayment({
        ...response,
        id: response.id,
        sitterName: selectedSitter?.name,
        sitterImage: selectedSitter?.image
      })
    }
    
  } catch (error) {
    // Manejar error
    console.error('Error al crear la reserva:', error)
    // Aquí podrías mostrar un toast de error o un estado de error
  } finally {
    setIsProcessing(false)
  }

  handleClose()
}
```

#### **Paso 2: Endpoint Spring Boot**
```java
@PostMapping("/bookings")
public ResponseEntity<BookingDTO> createBooking(@RequestBody CreateBookingRequest request) {
    // Validar que el usuario autenticado puede hacer la reserva
    User currentUser = getCurrentUser();
    
    // Validar que el cuidador existe y está disponible
    Sitter sitter = sitterService.findById(request.getSitterId());
    if (!sitter.isAvailable(request.getDate(), request.getStartTime(), request.getEndTime())) {
        throw new BadRequestException("El cuidador no está disponible en esa fecha/hora");
    }
    
    // Crear la reserva
    Booking booking = new Booking();
    booking.setOwner(currentUser);
    booking.setSitter(sitter);
    booking.setService(request.getService());
    booking.setDate(LocalDate.parse(request.getDate()));
    booking.setStartTime(request.getStartTime() != null ? LocalTime.parse(request.getStartTime()) : null);
    booking.setEndTime(request.getEndTime() != null ? LocalTime.parse(request.getEndTime()) : null);
    booking.setDuration(request.getDuration());
    booking.setPrice(request.getPrice());
    booking.setSpecialRequests(request.getSpecialRequests());
    booking.setEmergencyContact(request.getEmergencyContact());
    booking.setStatus(BookingStatus.PENDING_PAYMENT);
    
    // Guardar mascotas de la reserva
    List<BookingPet> bookingPets = request.getPets().stream()
        .map(petDto -> {
            BookingPet bookingPet = new BookingPet();
            bookingPet.setBooking(booking);
            bookingPet.setPetName(petDto.getName());
            bookingPet.setPetType(petDto.getType());
            bookingPet.setPetBreed(petDto.getBreed());
            bookingPet.setPetAge(petDto.getAge());
            bookingPet.setSpecialNeeds(petDto.getSpecialNeeds());
            return bookingPet;
        })
        .collect(Collectors.toList());
    
    booking.setBookingPets(bookingPets);
    
    Booking savedBooking = bookingService.save(booking);
    
    return ResponseEntity.ok(BookingDTO.fromEntity(savedBooking));
}
```

---

### 5. **PAGOS - PaymentGateway.tsx**

#### **Paso 1: Integración con el backend**
```javascript
// En /components/PaymentGateway.tsx
import { paymentAPI } from "../services/api.js"

// Buscar la función handlePayment (aprox. línea 50)
const handlePayment = async (paymentData) => {
  setIsProcessing(true)
  setError("")

  try {
    // Paso 1: Crear intención de pago
    const paymentIntent = await paymentAPI.createPaymentIntent(totalAmount, {
      bookingIds: cartItems.map(item => item.id),
      items: cartItems
    })

    // Paso 2: Procesar pago (aquí integrarías con Stripe, PayPal, etc.)
    // Por ahora simulamos un pago exitoso
    const paymentResult = await simulatePayment(paymentIntent, paymentData)

    // Paso 3: Confirmar pago en el backend
    const confirmation = await paymentAPI.confirmPayment(
      paymentIntent.id, 
      paymentResult.paymentMethodId
    )

    // Éxito
    onPaymentSuccess({
      ...confirmation,
      bookings: cartItems
    })

  } catch (error) {
    setError(error.message || "Error al procesar el pago")
  } finally {
    setIsProcessing(false)
  }
}

// Función auxiliar para simular pago (reemplazar con integración real)
const simulatePayment = async (paymentIntent, paymentData) => {
  // Aquí integrarías con tu pasarela de pagos real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentMethodId: "pm_mock_" + Date.now(),
        transactionId: "txn_" + Date.now()
      })
    }, 2000)
  })
}
```

#### **Paso 2: Endpoints Spring Boot**
```java
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@RequestBody PaymentIntentRequest request) {
        // Validar el monto y las reservas
        User currentUser = getCurrentUser();
        
        // Validar que todas las reservas pertenecen al usuario actual
        List<Booking> bookings = bookingService.findByIds(request.getBookingIds());
        bookings.forEach(booking -> {
            if (!booking.getOwner().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("No tienes permisos para esta reserva");
            }
        });
        
        // Crear intención de pago
        PaymentIntent paymentIntent = new PaymentIntent();
        paymentIntent.setAmount(request.getAmount());
        paymentIntent.setOwner(currentUser);
        paymentIntent.setBookings(bookings);
        paymentIntent.setStatus(PaymentStatus.PENDING);
        
        PaymentIntent savedIntent = paymentService.save(paymentIntent);
        
        PaymentIntentResponse response = new PaymentIntentResponse();
        response.setId(savedIntent.getId());
        response.setAmount(savedIntent.getAmount());
        response.setClientSecret("pi_" + savedIntent.getId() + "_secret");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/confirm")
    public ResponseEntity<PaymentConfirmationResponse> confirmPayment(@RequestBody PaymentConfirmationRequest request) {
        PaymentIntent paymentIntent = paymentService.findById(request.getPaymentIntentId());
        
        // Procesar pago con la pasarela externa (Stripe, PayPal, etc.)
        PaymentResult result = paymentGatewayService.processPayment(
            paymentIntent.getAmount(),
            request.getPaymentMethodId()
        );
        
        if (result.isSuccessful()) {
            // Actualizar estado de reservas
            paymentIntent.getBookings().forEach(booking -> {
                booking.setStatus(BookingStatus.CONFIRMED);
                bookingService.save(booking);
            });
            
            // Actualizar estado de pago
            paymentIntent.setStatus(PaymentStatus.COMPLETED);
            paymentIntent.setTransactionId(result.getTransactionId());
            paymentService.save(paymentIntent);
            
            // Enviar notificaciones
            notificationService.notifyPaymentSuccess(paymentIntent);
            
            PaymentConfirmationResponse response = new PaymentConfirmationResponse();
            response.setSuccess(true);
            response.setTransactionId(result.getTransactionId());
            response.setBookings(paymentIntent.getBookings().stream()
                .map(BookingDTO::fromEntity)
                .collect(Collectors.toList()));
                
            return ResponseEntity.ok(response);
        } else {
            throw new PaymentException("El pago no pudo ser procesado: " + result.getErrorMessage());
        }
    }
}
```

---

### 6. **DASHBOARD DEL PROPIETARIO - OwnerDashboard.tsx**

#### **Paso 1: Cargar datos reales**
```javascript
// En /components/OwnerDashboard.tsx
import { dashboardAPI, bookingAPI } from "../services/api.js"

// Agregar estados para datos del dashboard
const [dashboardData, setDashboardData] = useState({
  stats: {
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    favoriteServices: []
  },
  recentBookings: [],
  upcomingBookings: []
})
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState("")

// Agregar función para cargar datos
const loadDashboardData = async () => {
  setIsLoading(true)
  setError("")
  
  try {
    const [statsResponse, bookingsResponse] = await Promise.all([
      dashboardAPI.getOwnerStats(userData.id),
      bookingAPI.getUserBookings(userData.id, 'owner')
    ])
    
    setDashboardData({
      stats: statsResponse,
      recentBookings: bookingsResponse.recent || [],
      upcomingBookings: bookingsResponse.upcoming || []
    })
    
  } catch (error) {
    setError(error.message || "Error al cargar los datos")
  } finally {
    setIsLoading(false)
  }
}

// Cargar datos al montar el componente
useEffect(() => {
  if (userData?.id) {
    loadDashboardData()
  }
}, [userData?.id])
```

#### **Paso 2: Endpoint Spring Boot**
```java
@GetMapping("/dashboard/owner/{userId}")
public ResponseEntity<OwnerDashboardDTO> getOwnerStats(@PathVariable Long userId) {
    // Validar que el usuario puede acceder a estos datos
    User currentUser = getCurrentUser();
    if (!currentUser.getId().equals(userId) && !currentUser.isAdmin()) {
        throw new ForbiddenException("No tienes permisos para acceder a estos datos");
    }
    
    // Obtener estadísticas
    OwnerStats stats = dashboardService.getOwnerStats(userId);
    List<Booking> recentBookings = bookingService.getRecentBookingsByOwner(userId, 5);
    List<Booking> upcomingBookings = bookingService.getUpcomingBookingsByOwner(userId);
    
    OwnerDashboardDTO response = new OwnerDashboardDTO();
    response.setStats(OwnerStatsDTO.fromEntity(stats));
    response.setRecentBookings(recentBookings.stream()
        .map(BookingDTO::fromEntity)
        .collect(Collectors.toList()));
    response.setUpcomingBookings(upcomingBookings.stream()
        .map(BookingDTO::fromEntity)
        .collect(Collectors.toList()));
    
    return ResponseEntity.ok(response);
}
```

---

### 7. **ADMINISTRACIÓN - ServicePricingManager.tsx**

#### **Paso 1: Conectar con datos reales**
```javascript
// En /components/ServicePricingManager.tsx
import { serviceAPI } from "../services/api.js"

// Modificar el estado inicial de servicios
const [services, setServices] = useState([])
const [isLoading, setIsLoading] = useState(true)

// Cargar servicios del backend
const loadServices = async () => {
  setIsLoading(true)
  try {
    const response = await serviceAPI.getServicePricing()
    setServices(response.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      currency: service.currency || 'EUR',
      priceType: service.priceType,
      commission: service.commission,
      active: service.active,
      lastUpdated: service.lastUpdated,
      averageMarketPrice: service.averageMarketPrice,
      popularityScore: service.popularityScore
    })))
  } catch (error) {
    console.error('Error al cargar servicios:', error)
  } finally {
    setIsLoading(false)
  }
}

// Modificar handleSaveService
const handleSaveService = async (serviceId) => {
  try {
    const service = services.find(s => s.id === serviceId)
    if (!service) return
    
    await serviceAPI.updateService(serviceId, {
      name: service.name,
      price: service.price,
      currency: service.currency,
      priceType: service.priceType,
      commission: service.commission,
      active: service.active
    })
    
    // Recargar servicios
    await loadServices()
    setEditingService(null)
    
  } catch (error) {
    console.error('Error al guardar servicio:', error)
  }
}

// Cargar al montar
useEffect(() => {
  loadServices()
}, [])
```

---

## 📊 **ESTRUCTURAS DE DATOS REQUERIDAS**

### **Estructura de Usuario**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Juan Pérez",
  "userType": "owner", // "owner", "sitter", "admin"
  "identificationType": "cedula_ciudadania",
  "identificationNumber": "12345678",
  "avatar": "https://example.com/avatar.jpg",
  "pets": [
    {
      "id": 1,
      "name": "Max",
      "type": "Perro",
      "breed": "Golden Retriever",
      "age": "3 años",
      "image": "https://example.com/pet.jpg",
      "specialNeeds": "Alergia al pollo"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "isVerified": true,
  "isActive": true
}
```

### **Estructura de Cuidador**
```json
{
  "id": 1,
  "name": "María García",
  "email": "maria@example.com",
  "rating": 4.8,
  "totalReviews": 127,
  "completedJobs": 243,
  "location": "Madrid Centro",
  "distance": "0.8 km",
  "services": ["Paseo de perros", "Cuidado en casa"],
  "priceRange": "15.00 - 18.50€/hora",
  "availability": "Disponible hoy",
  "verified": true,
  "responseTime": "En 1 hora",
  "experience": "5 años",
  "about": "Amante de los animales...",
  "image": "https://example.com/sitter.jpg",
  "specialties": ["Perros grandes", "Cachorros", "Medicación"]
}
```

### **Estructura de Reserva**
```json
{
  "id": 1,
  "ownerId": 1,
  "sitterId": 2,
  "service": "Paseo de perros",
  "date": "2024-02-15",
  "startTime": "09:00",
  "endTime": "11:00",
  "duration": 2,
  "serviceUnit": "horas",
  "price": 30.00,
  "currency": "EUR",
  "status": "confirmed", // "pending", "confirmed", "completed", "cancelled"
  "pets": [
    {
      "name": "Max",
      "type": "Perro",
      "breed": "Golden Retriever",
      "age": "3 años",
      "specialNeeds": "Alergia al pollo"
    }
  ],
  "specialRequests": "Llevar correa extra",
  "emergencyContact": "Ana Pérez - 666123456",
  "createdAt": "2024-02-10T15:30:00Z"
}
```

---

## ✅ **CHECKLIST DE INTEGRACIÓN**

### **Fase 1: Configuración Base** 
- [ ] Configurar variables de entorno (.env)
- [ ] Configurar CORS en Spring Boot
- [ ] Configurar seguridad JWT
- [ ] Probar conexión básica con el backend

### **Fase 2: Autenticación**
- [ ] Integrar Login.tsx con authAPI.login
- [ ] Integrar Register.tsx con authAPI.register  
- [ ] Integrar EmailVerification.tsx
- [ ] Configurar manejo de tokens JWT
- [ ] Probar flujo completo de autenticación

### **Fase 3: Gestión de Usuarios**
- [ ] Integrar ProfileManager.tsx
- [ ] Integrar carga de perfiles de usuario
- [ ] Integrar actualización de perfiles
- [ ] Integrar subida de imágenes
- [ ] Probar CRUD de mascotas

### **Fase 4: Búsqueda y Servicios**
- [ ] Integrar SearchSitters.tsx con sitterAPI.searchSitters
- [ ] Integrar ServicesView.tsx con serviceAPI.getAllServices
- [ ] Implementar filtros de búsqueda
- [ ] Integrar sistema de precios centralizado
- [ ] Probar búsquedas con diferentes filtros

### **Fase 5: Reservas**
- [ ] Integrar BookingModal.tsx con bookingAPI.createBooking
- [ ] Integrar calendario de disponibilidad
- [ ] Integrar BookingManager.tsx
- [ ] Implementar estados de reserva
- [ ] Probar flujo completo de reserva

### **Fase 6: Pagos**
- [ ] Integrar PaymentGateway.tsx
- [ ] Configurar pasarela de pagos externa
- [ ] Implementar confirmación de pagos
- [ ] Integrar historial de pagos
- [ ] Probar transacciones

### **Fase 7: Dashboards**
- [ ] Integrar OwnerDashboard.tsx
- [ ] Integrar SitterDashboard.tsx  
- [ ] Integrar AdminDashboard.tsx
- [ ] Implementar estadísticas en tiempo real
- [ ] Probar métricas y reportes

### **Fase 8: Administración**
- [ ] Integrar UserManagement.tsx
- [ ] Integrar ServicePricingManager.tsx
- [ ] Integrar AllReports.tsx y AllFlaggedContent.tsx
- [ ] Implementar funciones de moderación
- [ ] Probar panel de administración

### **Fase 9: Testing y Optimización**
- [ ] Implementar manejo de errores global
- [ ] Agregar estados de carga en todos los componentes
- [ ] Optimizar llamadas API (cache, debounce)
- [ ] Pruebas de rendimiento
- [ ] Pruebas de integración end-to-end

### **Fase 10: Producción**
- [ ] Configurar variables de entorno para producción
- [ ] Configurar HTTPS y certificados SSL
- [ ] Implementar monitoreo y logs
- [ ] Configurar CI/CD
- [ ] Deploy y testing en producción

---

## 🔧 **TESTING Y DEPURACIÓN**

### **Testing Individual de APIs**
```javascript
// Crear archivo /src/utils/apiTest.js
import { authAPI, sitterAPI, bookingAPI } from '../services/api.js'

export const testAPIs = {
  // Test de autenticación
  testLogin: async () => {
    try {
      const result = await authAPI.login('test@example.com', 'password', 'owner')
      console.log('✅ Login exitoso:', result)
      return true
    } catch (error) {
      console.error('❌ Error en login:', error)
      return false
    }
  },

  // Test de búsqueda
  testSearch: async () => {
    try {
      const result = await sitterAPI.searchSitters({ location: 'Madrid' })
      console.log('✅ Búsqueda exitosa:', result)
      return true
    } catch (error) {
      console.error('❌ Error en búsqueda:', error)
      return false
    }
  },

  // Test completo
  runAllTests: async () => {
    console.log('🧪 Iniciando tests de API...')
    const results = await Promise.all([
      testAPIs.testLogin(),
      testAPIs.testSearch()
    ])
    
    const success = results.every(r => r)
    console.log(success ? '✅ Todos los tests pasaron' : '❌ Algunos tests fallaron')
    return success
  }
}

// Usar en consola del navegador: testAPIs.runAllTests()
```

### **Herramientas de Depuración**
```javascript
// Agregar al inicio de /services/api.js
const DEBUG = process.env.NODE_ENV === 'development'

const logRequest = (url, options) => {
  if (DEBUG) {
    console.log(`🔗 API Request: ${options?.method || 'GET'} ${url}`)
    if (options?.body) {
      console.log('📤 Body:', JSON.parse(options.body))
    }
  }
}

const logResponse = (url, response, data) => {
  if (DEBUG) {
    console.log(`✅ API Response: ${url}`, { status: response.status, data })
  }
}

// Modificar handleResponse para incluir logs
const handleResponse = async (response, url) => {
  const data = await response.json().catch(() => ({}))
  
  if (DEBUG) {
    logResponse(url, response, data)
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  return data
}
```

---

## 🎯 **PASOS RECOMENDADOS PARA COMENZAR**

### **1. Empezar con Autenticación (30 minutos)**
1. Configurar variables de entorno
2. Implementar endpoint `/api/auth/login` en Spring Boot
3. Modificar `Login.tsx` para usar `authAPI.login`
4. Probar login desde la consola del navegador

### **2. Continuar con Búsqueda (45 minutos)**
1. Implementar endpoint `/api/sitters/search`
2. Modificar `SearchSitters.tsx` para usar `sitterAPI.searchSitters`
3. Agregar estados de carga y error
4. Probar búsqueda con diferentes filtros

### **3. Seguir con Reservas (60 minutos)**
1. Implementar endpoint `/api/bookings`
2. Modificar `BookingModal.tsx` para usar `bookingAPI.createBooking`
3. Probar flujo completo de reserva
4. Integrar con sistema de pagos

### **4. Dashboard y Administración (90 minutos)**
1. Implementar endpoints de dashboard
2. Conectar componentes con datos reales
3. Probar funcionalidades administrativas

---

¡Tu proyecto está **completamente preparado** para la integración! Solo necesitas implementar los endpoints en Spring Boot siguiendo esta guía y conectar los componentes uno por uno. 

**Recomendación:** Comenzar con autenticación, ya que es la base para todo lo demás.