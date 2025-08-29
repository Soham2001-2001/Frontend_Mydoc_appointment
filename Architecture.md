
## erDiagram_Doctor_Appointment
erDiagram
    %% NOTE: Mermaid ER doesn't support composite UNIQUE syntax.
    %% Enforce (doctor_id, date, start_time, end_time) uniqueness in SQL only.

    PATIENT {
      BIGINT id PK
      VARCHAR name
      VARCHAR email  "UNIQUE"
      VARCHAR phone  "UNIQUE"
      DATE    dob    "nullable"
      ENUM    gender "MALE|FEMALE|OTHER (nullable)"
      VARCHAR address "nullable"
      VARCHAR password
      DATETIME created_at
      DATETIME updated_at
    }

    SPECIALIZATION {
      BIGINT id PK
      VARCHAR name "UNIQUE"
      DATETIME created_at
      DATETIME updated_at
    }

    DOCTOR {
      BIGINT id PK
      VARCHAR name
      VARCHAR email  "UNIQUE"
      VARCHAR phone  "UNIQUE"
      VARCHAR password
      BIGINT specialization_id FK
      DECIMAL fee "nullable"
      DATETIME created_at
      DATETIME updated_at
    }

    DOCTOR_AVAILABILITY {
      BIGINT id PK
      BIGINT doctor_id FK
      DATE   date
      TIME   start_time
      TIME   end_time
      BOOLEAN is_available
      DATETIME created_at
      DATETIME updated_at
      %% UNIQUE(doctor_id, date, start_time, end_time) in DB DDL
    }

    APPOINTMENT {
      BIGINT id PK
      BIGINT patient_id FK
      BIGINT doctor_id  FK
      BIGINT availability_id FK
      ENUM   status "PENDING|BOOKED|CONFIRMED|CANCELLED"
      DATETIME created_at
      DATETIME updated_at
    }

    PATIENT ||--o{ APPOINTMENT : books
    DOCTOR  ||--o{ APPOINTMENT : receives
    DOCTOR  ||--o{ DOCTOR_AVAILABILITY : has
    SPECIALIZATION ||--o{ DOCTOR : categorized_as
    DOCTOR_AVAILABILITY ||--|| APPOINTMENT : consumed_by

## classDiagram_Doctor_Appointment_Application
classDiagram
  direction LR

  class Patient {
    +Long id
    +String name
    +String email
    +String phone
    +LocalDate dob
    +String gender  // "MALE|FEMALE|OTHER"
    +String address
    +String password
  }

  class Specialization {
    +Long id
    +String name
  }

  class Doctor {
    +Long id
    +String name
    +String email
    +String phone
    +String password
    +BigDecimal fee
    +Specialization specialization
  }

  class DoctorAvailability {
    +Long id
    +Doctor doctor
    +LocalDate date
    +LocalTime startTime
    +LocalTime endTime
    +boolean available
  }

  class AppointmentStatus {
    <<enumeration>>
    PENDING
    BOOKED
    CONFIRMED
    CANCELLED
  }

  class Appointment {
    +Long id
    +Patient patient
    +Doctor doctor
    +DoctorAvailability availability
    +AppointmentStatus status
  }

  %% --- DTOs ---
  class RegisterPatientRequest {
    +String name
    +String email
    +String phone
    +String password
    +LocalDate dob?
    +String gender?
    +String address?
  }

  class LoginRequest {
    +String email
    +String password
  }

  class CreateDoctorRequest {
    +String name
    +String email
    +String phone
    +Long specializationId
    +String password
  }

  class AvailabilityRequest {
    +LocalDate date
    +String startTime  // "HH:mm"
    +String endTime    // "HH:mm"
  }

  class AppointmentCreateRequest {
    +Long doctorId
    +Long availabilityId
  }

  class AppointmentRescheduleRequest {
    +Long appointmentId
    +Long newAvailabilityId
  }

  class UpdatePatientRequest {
    +String name
    +String email
    +String phone
    +LocalDate dob?
    +String gender?
    +String address?
  }

  class ChangePasswordRequest {
    +String currentPassword
    +String newPassword
    +String confirmNewPassword
  }

  class PatientProfileResponse {
    +Long id
    +String name
    +String email
    +String phone
    +LocalDate dob?
    +String gender?
    +String address?
  }

  class DoctorAppointmentResponse {
    +Long id
    +String patientName
    +String date
    +String startTime
    +String endTime
    +String status
  }

  Patient "1" --> "many" Appointment
  Doctor "1" --> "many" Appointment
  Doctor "1" --> "many" DoctorAvailability
  Specialization "1" --> "many" Doctor
  Appointment --> AppointmentStatus
  Appointment --> DoctorAvailability

## SCHEMA: doctor_appointment
-- SCHEMA: doctor_appointment

CREATE TABLE specialization (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(150) NOT NULL UNIQUE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE patient (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  phone        VARCHAR(20)  NOT NULL UNIQUE,
  dob          DATE         NULL,
  gender       ENUM('MALE','FEMALE','OTHER') NULL,
  address      VARCHAR(255) NULL,
  password     VARCHAR(255) NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE doctor (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  name              VARCHAR(150) NOT NULL,
  email             VARCHAR(150) NOT NULL UNIQUE,
  phone             VARCHAR(20)  NOT NULL UNIQUE,
  password          VARCHAR(255) NOT NULL,
  specialization_id BIGINT NOT NULL,
  fee               DECIMAL(10,2) NULL,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doctor_spec FOREIGN KEY (specialization_id) REFERENCES specialization(id)
) ENGINE=InnoDB;

CREATE TABLE doctor_availability (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  doctor_id     BIGINT NOT NULL,
  date          DATE  NOT NULL,
  start_time    TIME  NOT NULL,
  end_time      TIME  NOT NULL,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_avail_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(id),
  CONSTRAINT uq_slot UNIQUE (doctor_id, date, start_time, end_time)
) ENGINE=InnoDB;

CREATE TABLE appointment (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id      BIGINT NOT NULL,
  doctor_id       BIGINT NOT NULL,
  availability_id BIGINT NOT NULL,
  status          ENUM('PENDING','BOOKED','CONFIRMED','CANCELLED') NOT NULL DEFAULT 'BOOKED',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_patient   FOREIGN KEY (patient_id) REFERENCES patient(id),
  CONSTRAINT fk_appt_doctor    FOREIGN KEY (doctor_id)  REFERENCES doctor(id),
  CONSTRAINT fk_appt_avail     FOREIGN KEY (availability_id) REFERENCES doctor_availability(id)
) ENGINE=InnoDB;

-- Helpful indexes
CREATE INDEX ix_patient_email      ON patient(email);
CREATE INDEX ix_patient_phone      ON patient(phone);
CREATE INDEX ix_doctor_email       ON doctor(email);
CREATE INDEX ix_doctor_phone       ON doctor(phone);
CREATE INDEX ix_avail_doctor_date  ON doctor_availability(doctor_id, date);
CREATE INDEX ix_appt_patient       ON appointment(patient_id);
CREATE INDEX ix_appt_doctor        ON appointment(doctor_id);
CREATE INDEX ix_appt_status        ON appointment(status);
