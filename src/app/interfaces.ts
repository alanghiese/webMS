export interface UserCredentials {
  enrollmentId: string,      // numero de matricula
  password: string           // password (texto plano)
}

export interface JSONResponse {
  data: any,
  error: {
    code: number,
    message: string
  }
}

export interface LoginResponse {
  usuario: UserAccount,       // datos de usuario
  conexion: { data: Client }, // conexion con la fuente de datos (automatico)
  publicidad: string          // URI de la imagen/gif publicitario
}

export interface UserAccount {
  idUsuario: number,          // id de usuario
  nombreCompleto: string,     // nombre completo del usuario
  codigo: number,             // ??
  matricula: number,          // matricula del medico
  tipomatric: string,         // tipo de matricula
  esMedico: boolean,          // "S"
  daTurnos: boolean,          // "S"
  permisos: string,           // ""
  especialidad: string,       // nombre de la especialidad del medico
  categoria: string,          // categoria del medico
  logoDefault: string,        // logo del usuario por default
  logoChicoDefault: string,   // logo del usuario por default (chico)
  fuenteDatos: DataSource[],  
}

export interface DataSource {
  nombreFuente: string,       // nombre de la fuente de datos
  nombre: string,             // nombre de la empresa
  logo: string,               // logo de la empresa
  logoChico: string,          // logo de la empresa (chico)
}

export interface Client {
  cliente: string,            // nombre de la fuente de datos
  empresa: string,            // nombre de la empresa
  logo: string,               // logo de la empresa
  logoChico: string,          // logo de la empresa (chico)
  logoDefault: string,        // logo por default
  logoChicoDefault: string,   // logo por default (chico)
  turnos: AppointmentQuery    // turnos del dia actual (sin campo "msg")
  otracosa: any;
}


export interface AppointmentQuery {
  [key: string]: string | Appointment
}

export interface DoctorQuery {
  [key: string]: string | Doctor
}

export interface TurnosV0Query {
  [key: string]: string | turnosV0
}

export interface Doctor {
  TIPOMATRIC: string,
  MATRICULA: string,
  DURATURNO: number,
  LeyendaWeb: string,
  categoria: string,
  especialid: string,
  codigo: string,
  nombre: string,
  cantcons: number,
  restriccionesOS: any[]
}

export interface Appointment {
  id: number,                 // id del turno
  numero: number,             // id del paciente
  apellido: string,           // apellido del paciente
  matricula: number,          // matricula del medico
  tipomatri: string,          // tipo de matricula del medico, ej: "PRO"
  dia: string,                // yyyy-mm-dd
  hora: string,               // HH:MM
  practica: string,           // ej: "42.01.01"
  motivo: string,             // generalmente aqui el nro. de telefono del paciente
  proximo: string,            // ??
  obra: string,               // nombre de obra social
  codigoCobertura: number,    // codigo de la cobertura
  afiliado: string,           // nro. de afiliado de obra social
  estado: string,             // "S" sala de espera, "A" atendido, "" paciente no se ha presentado aun
  debe: string,               // ??
  coment: string,             // notas para el medico de parte de la secretaria
  origen: string              // ??
}

export interface MedicalHistory {
  practicas: MedicalHistoryEntry[],
  ultimoIDPractica: string
}

export interface MedicalHistoryEntry {
  fecha: string,               // fecha de la práctica (dd-mm-yyyy)
  medico: number,              // codigo de medico
  nommedico: string,           // nombre de medico
  texto: string,               // descripcion de la visita
  codigo_practica: string,     // codigo de practica xx.xx.xx
  nroorden: number,            // numero de orden
  estudiosolicitado: string,   // estudios solicitados
  cobertura: string,           // ej: "42.0"
  onombre: string,             // nombre de obra social
  afiliado: string,            // numero de afiliado
  habitacion: string           // habitacion
}

export interface SearchPatientResponse {
  pacientes: Patient[],         // lista de pacientes
  practicas: MedicalHistory     // ultimas practicas del primer paciente en la lista
}

export interface HealthInsurance {
  onombre: string,            // nombre de la cobertura
  afiliado: string,           // credencial de afiliado
  nomplan: string,            // nombre del plan
  tipoafiliado: string,       // detalles del tipo de afiliado
  codigoCobertura: number     // codigo de la cobertura
}

export interface Patient {
  numero: number,              // numero de paciente
  nombre: string,              // nombre completo
  direcc: string,              // direccion
  localidad: string,
  sexo: string,
  grupo: string,
  factor: string,
  peso: string,
  talla: string,
  tipodoc: string,             // dni, le, etc.
  nrodoc: string,
  numerohc: number,            // numero de historia clinica
  fechaNac: string,            // fecha de nacimiento (dd-mm-yyyy)
  telefono: string,
  email: string,
  fuv: string,                 // fecha de ultima visita (dd-mm-yyyy)
  relpacob: HealthInsurance[]  // coberturas del paciente
}

export interface turnosV0{
  id:any;
  tema:any;
  subTema:any;
  nomUsuario:any;
  fecha1:any;
  fecha2:any;
  campo1:any;
  valor1:any;
  campo2:string;
  valor2:any;
  campo3:string;
  valor3:any;  
  campo4:string;
  valor4:any;
  campo5:any;
  valor5:any;
  campo6:any;
  valor6:any;
  campo7:any;
  valor7:any;
}

export interface coverageObject{
  codigo;
  estado;
  gerenciadora;
  label;
  nombre;
  value;
}

export interface serviceObject{
  SERVICIO;
}

export class webVSdesktop{ //esta aca porque tuve que modificar el interface por class nomas, muy desubicado quedo 
  
  constructor(
        public name:string,
        public web: number,
        public desktop: number,
    ){};
}