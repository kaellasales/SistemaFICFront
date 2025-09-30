// Utilitários de validação para formulários

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = sum % 11
  let firstDigit = remainder < 2 ? 0 : 11 - remainder
  
  if (parseInt(cleanCPF.charAt(9)) !== firstDigit) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = sum % 11
  let secondDigit = remainder < 2 ? 0 : 11 - remainder
  
  return parseInt(cleanCPF.charAt(10)) === secondDigit
}

// Validação de CEP
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de telefone
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

// Validação de data de nascimento
export const validateBirthDate = (date: string): boolean => {
  const birthDate = new Date(date)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  
  // Verifica se a data é válida
  if (isNaN(birthDate.getTime())) return false
  
  // Verifica se a idade está entre 16 e 100 anos
  return age >= 16 && age <= 100
}

// Validação de campos obrigatórios
export const validateRequired = (value: string, fieldName: string): ValidationError | null => {
  if (!value || value.trim() === '') {
    return {
      field: fieldName,
      message: `${fieldName} é obrigatório`
    }
  }
  return null
}

// Validação de tamanho mínimo
export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationError | null => {
  if (value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} deve ter pelo menos ${minLength} caracteres`
    }
  }
  return null
}

// Validação de tamanho máximo
export const validateMaxLength = (value: string, maxLength: number, fieldName: string): ValidationError | null => {
  if (value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} deve ter no máximo ${maxLength} caracteres`
    }
  }
  return null
}

// Validação de formato de nome
export const validateName = (name: string, fieldName: string): ValidationError | null => {
  if (!name || name.trim() === '') {
    return {
      field: fieldName,
      message: `${fieldName} é obrigatório`
    }
  }
  
  if (name.length < 2) {
    return {
      field: fieldName,
      message: `${fieldName} deve ter pelo menos 2 caracteres`
    }
  }
  
  // Verifica se contém apenas letras, espaços e acentos
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/
  if (!nameRegex.test(name)) {
    return {
      field: fieldName,
      message: `${fieldName} deve conter apenas letras`
    }
  }
  
  return null
}

// Validação de RG
export const validateRG = (rg: string): ValidationError | null => {
  if (!rg || rg.trim() === '') {
    return {
      field: 'identidade',
      message: 'Número do RG é obrigatório'
    }
  }
  
  const cleanRG = rg.replace(/\D/g, '')
  if (cleanRG.length < 7 || cleanRG.length > 9) {
    return {
      field: 'identidade',
      message: 'RG deve ter entre 7 e 9 dígitos'
    }
  }
  
  return null
}

// Validação de arquivos
export const validateFiles = (files: File[], maxFiles: number = 5, maxSizeMB: number = 10): ValidationError | null => {
  if (files.length === 0) {
    return {
      field: 'documents',
      message: 'Pelo menos um documento é obrigatório'
    }
  }
  
  if (files.length > maxFiles) {
    return {
      field: 'documents',
      message: `Máximo de ${maxFiles} arquivos permitidos`
    }
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  for (const file of files) {
    if (file.size > maxSizeBytes) {
      return {
        field: 'documents',
        message: `Arquivo ${file.name} excede o tamanho máximo de ${maxSizeMB}MB`
      }
    }
  }
  
  return null
}

// Validação completa dos dados de matrícula
export const validateEnrollmentData = (data: any, files: File[]): ValidationResult => {
  const errors: ValidationError[] = []
  
  // Validação de dados pessoais
  const nomeError = validateName(data.nome, 'Nome')
  if (nomeError) errors.push(nomeError)
  
  const sobrenomeError = validateName(data.sobrenome, 'Sobrenome')
  if (sobrenomeError) errors.push(sobrenomeError)
  
  const dataNascimentoError = validateRequired(data.dataNascimento, 'Data de nascimento')
  if (dataNascimentoError) {
    errors.push(dataNascimentoError)
  } else if (!validateBirthDate(data.dataNascimento)) {
    errors.push({
      field: 'dataNascimento',
      message: 'Data de nascimento inválida ou idade fora do permitido (16-100 anos)'
    })
  }
  
  const sexoError = validateRequired(data.sexo, 'Sexo')
  if (sexoError) errors.push(sexoError)
  
  const cpfError = validateRequired(data.cpf, 'CPF')
  if (cpfError) {
    errors.push(cpfError)
  } else if (!validateCPF(data.cpf)) {
    errors.push({
      field: 'cpf',
      message: 'CPF inválido'
    })
  }
  
  const rgError = validateRG(data.identidade)
  if (rgError) errors.push(rgError)
  
  const orgaoError = validateRequired(data.orgaoExpedidor, 'Órgão expedidor')
  if (orgaoError) errors.push(orgaoError)
  
  const naturalidadeError = validateRequired(data.naturalidade, 'Naturalidade')
  if (naturalidadeError) errors.push(naturalidadeError)
  
  // Validação de contato
  const emailError = validateRequired(data.email, 'Email')
  if (emailError) {
    errors.push(emailError)
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Email inválido'
    })
  }
  
  const telefoneError = validateRequired(data.telefoneCelular, 'Telefone celular')
  if (telefoneError) {
    errors.push(telefoneError)
  } else if (!validatePhone(data.telefoneCelular)) {
    errors.push({
      field: 'telefoneCelular',
      message: 'Telefone celular inválido'
    })
  }
  
  // Validação de endereço
  const enderecoError = validateRequired(data.endereco, 'Endereço')
  if (enderecoError) errors.push(enderecoError)
  
  const numeroError = validateRequired(data.numero, 'Número')
  if (numeroError) errors.push(numeroError)
  
  const bairroError = validateRequired(data.bairro, 'Bairro')
  if (bairroError) errors.push(bairroError)
  
  const cidadeError = validateRequired(data.cidade, 'Cidade')
  if (cidadeError) errors.push(cidadeError)
  
  const cepError = validateRequired(data.cep, 'CEP')
  if (cepError) {
    errors.push(cepError)
  } else if (!validateCEP(data.cep)) {
    errors.push({
      field: 'cep',
      message: 'CEP inválido'
    })
  }
  
  // Validação de arquivos
  const filesError = validateFiles(files)
  if (filesError) errors.push(filesError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validação por etapa
export const validateStep = (step: number, data: any, files: File[]): ValidationResult => {
  const errors: ValidationError[] = []
  
  switch (step) {
    case 1: // Dados pessoais
      const nomeError = validateName(data.nome, 'Nome')
      if (nomeError) errors.push(nomeError)
      
      const sobrenomeError = validateName(data.sobrenome, 'Sobrenome')
      if (sobrenomeError) errors.push(sobrenomeError)
      
      const dataNascimentoError = validateRequired(data.dataNascimento, 'Data de nascimento')
      if (dataNascimentoError) {
        errors.push(dataNascimentoError)
      } else if (!validateBirthDate(data.dataNascimento)) {
        errors.push({
          field: 'dataNascimento',
          message: 'Data de nascimento inválida ou idade fora do permitido (16-100 anos)'
        })
      }
      
      const sexoError = validateRequired(data.sexo, 'Sexo')
      if (sexoError) errors.push(sexoError)
      
      const cpfError = validateRequired(data.cpf, 'CPF')
      if (cpfError) {
        errors.push(cpfError)
      } else if (!validateCPF(data.cpf)) {
        errors.push({
          field: 'cpf',
          message: 'CPF inválido'
        })
      }
      
      const rgError = validateRG(data.identidade)
      if (rgError) errors.push(rgError)
      
      const orgaoError = validateRequired(data.orgaoExpedidor, 'Órgão expedidor')
      if (orgaoError) errors.push(orgaoError)
      
      const naturalidadeError = validateRequired(data.naturalidade, 'Naturalidade')
      if (naturalidadeError) errors.push(naturalidadeError)
      break
      
    case 2: // Dados de contato
      const emailError = validateRequired(data.email, 'Email')
      if (emailError) {
        errors.push(emailError)
      } else if (!validateEmail(data.email)) {
        errors.push({
          field: 'email',
          message: 'Email inválido'
        })
      }
      
      const telefoneError = validateRequired(data.telefoneCelular, 'Telefone celular')
      if (telefoneError) {
        errors.push(telefoneError)
      } else if (!validatePhone(data.telefoneCelular)) {
        errors.push({
          field: 'telefoneCelular',
          message: 'Telefone celular inválido'
        })
      }
      break
      
    case 3: // Dados de endereço
      const enderecoError = validateRequired(data.endereco, 'Endereço')
      if (enderecoError) errors.push(enderecoError)
      
      const numeroError = validateRequired(data.numero, 'Número')
      if (numeroError) errors.push(numeroError)
      
      const bairroError = validateRequired(data.bairro, 'Bairro')
      if (bairroError) errors.push(bairroError)
      
      const cidadeError = validateRequired(data.cidade, 'Cidade')
      if (cidadeError) errors.push(cidadeError)
      
      const cepError = validateRequired(data.cep, 'CEP')
      if (cepError) {
        errors.push(cepError)
      } else if (!validateCEP(data.cep)) {
        errors.push({
          field: 'cep',
          message: 'CEP inválido'
        })
      }
      break
      
    case 4: // Documentos
      const filesError = validateFiles(files)
      if (filesError) errors.push(filesError)
      break
      
    case 5: // Confirmação
      // Não há validações específicas para a etapa de confirmação
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
