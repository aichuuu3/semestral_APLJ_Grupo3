# 🌐 Sistema APLIJ — Arquitectura de un Sistema de Donaciones  

> 🏫 **Universidad Tecnológica de Panamá**  
> 💻 **Facultad de Ingeniería de Sistemas Computacionales**  
> 📘 **Ingeniería de Software Aplicada III**  
> 👩‍🏫 **Facilitadora:** Militza Atencio 
> 👥 **Grupo #3 — 1GS132**  
> 📅 **Primera Entrega:** 08 / 10 / 2025  

---

## 🧩 Descripción del Proyecto  

El **Sistema APLIJ** es una plataforma web de **gestión de donaciones y membresías** para una organización sin fines de lucro.  
El proyecto aplica el **modelo de arquitectura 4+1 vistas** bajo el **patrón Modelo–Vista–Controlador (MVC)** y el estilo **cliente–servidor**.  

Su propósito es documentar de forma integral la **arquitectura del sistema de donaciones**, incluyendo vistas funcionales, estructurales y físicas, junto con el diseño de interfaz de usuario y la aplicación de patrones de diseño.

---

## 🚀 Objetivos  

- **Escalabilidad:** permitir el crecimiento del sistema sin afectar el rendimiento.  
- **Mantenibilidad:** favorecer la modularidad y facilidad de actualización.  
- **Seguridad:** proteger la información de donantes y beneficiarios.  
- **Disponibilidad:** asegurar funcionamiento continuo y confiable.  

---

## ⚙️ Tecnologías utilizadas  

| Categoría | Tecnología / Herramienta |
|------------|--------------------------|
| **Backend** | Python |
| **Base de Datos** | MySQL |
| **Frontend** | HTML, CSS, JavaScript |
| **Arquitectura** | MVC (Modelo-Vista-Controlador) |
| **Patrones de diseño** | Facade, Template Method |
| **Modelado UML** | Visual Paradigm |
| **Repositorio / Documentación** | GitHub, SharePoint |

---

## 🧱 Modelo Arquitectónico  

El proyecto se fundamenta en el **modelo 4+1 vistas de Kruchten**, representando cinco dimensiones:  

1. **Vista de Casos de Uso:** requerimientos funcionales (actores, escenarios y objetivos).  
2. **Vista Lógica:** diagramas de clases, paquetes y entidades.  
3. **Vista de Proceso:** diagramas de secuencia y comunicación.  
4. **Vista de Desarrollo:** organización de componentes y módulos MVC.  
5. **Vista Física:** despliegue del sistema cliente-servidor.  

---

## 💡 Patrones de Diseño  

### 🔸 **Facade Pattern**
> Simplifica la integración con servicios de pago externos como **Yappy, ACH** y **tarjeta de crédito**, centralizando la lógica en una única interfaz.

### 🔸 **Template Method**
> Estandariza el flujo de **inicio de sesión** para diferentes tipos de usuarios (Administrador, Miembro, Contador), permitiendo personalización sin duplicar código.

---

## 🧠 Casos de Uso Destacados  

| Código | Nombre | Actor | Descripción |
|---------|---------|--------|-------------|
| CU-01 | Iniciar Sesión | Usuario | Permite acceder al sistema validando credenciales. |
| CU-02 | Solicitar Membresía | No miembro | Solicita acceso como miembro activo. |
| CU-04 | Gestionar Miembros | Administrador | Registra, consulta y actualiza datos de miembros. |
| CU-06 | Gestionar Talleres | Administrador | Crea y edita talleres dentro del sistema. |
| CU-07 | Pagar Cuota | Miembro | Permite realizar pagos con métodos electrónicos. |
| CU-09 | Generar Informe de Pago | Contador | Crea reportes financieros por año. |

---

## 🖥️ Diseño de Interfaz  

> Diseño centrado en el usuario (UX/UI)  
> Estilo minimalista y funcional, adaptable (responsive design).  

🎨 **Principales pantallas:**
- Inicio de sesión  
- Solicitud de membresía  
- Gestión de miembros y libros  
- Visualización de talleres  
- Generación e impresión de informes  

---

## 🧮 Requerimientos No Funcionales  

| Tipo | Ejemplo |
|------|----------|
| **Usabilidad** | Interfaz intuitiva y validación de formularios. |
| **Seguridad** | Autenticación por roles, contraseñas cifradas y HTTPS. |
| **Rendimiento** | Transacciones ≤ 6 segundos. |
| **Interoperabilidad** | Integración con pasarela Yappy. |
| **Diseño** | Arquitectura MVC obligatoria. |

---

## 🧑‍💻 Equipo de Desarrollo  

| Integrante | ID |
|-------------|----|
| Ana Duarte | 8-1018-2345 | ***Coordinadora***
| Beitia Bethel | 4-828-2349 |
| Juárez Edgar | 8-962-1614 |
| Alexandro Gonzales | 8-1004-1193 |
| Jhansoni Jaen | 8-1013-1416 |

---

## 📽️ Recursos Complementarios  

🎥 **Presentación del proyecto:**  
[https://youtu.be/-WDKEyJHP3I](https://youtu.be/-WDKEyJHP3I)

📄 **Documento completo (PDF):**  
`Grupo#3-Proyecto_APLIJ.pdf`

---

## 📚 Bibliografía Destacada  

- Visual Paradigm (2023). *4 + 1 Vistas en Arquitectura de Sistemas UML*  
- Jayawardene, P. D. (2021). *4+1 Architectural View Model in Software*  
- Canelo, M. M. (2020). *Patrones de diseño de software*  
- Sánchez, M. Á. (2019). *Template Method Pattern*  
- Álvarez, A. (2022). *Patrón de diseño Facade en Swift*  

---

## 🧭 Lecciones Aprendidas  

- Comprender y aplicar el modelo **4+1** mejoró la visión global del sistema.  
- El patrón **MVC** permitió mantener una estructura modular y clara.  
- La documentación continua facilitó la comunicación entre el equipo.  
- Diseñar pensando en el usuario final potenció la experiencia UX.  

---

> 💬 *“La arquitectura del software no solo define cómo funciona un sistema, sino cómo evoluciona con el tiempo.”*  
> — Equipo APLIJ (2025)

---

🧾 **Licencia:** Proyecto académico — Uso educativo y demostrativo.
