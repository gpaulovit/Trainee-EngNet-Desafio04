# Modelagem do Banco de Dados

## Entidades principais

- **Aluno**
  - id, nome, matricula, email, turma_id

- **Turma**
  - id, nome, codigo, horario, curso, capacidade

- **Aula**
  - id, turma_id, data, hora_inicio, hora_fim, descricao

- **Frequencia**
  - id, aluno_id, aula_id, status, registrado_em

- **Usuario**
  - id, email, senha_hash, nome, perfil (professor/admin)

## Relacionamentos

- Turma 1:N Aula
- Turma 1:N Aluno
- Aula 1:N Frequencia
- Aluno 1:N Frequencia

## Regras de integridade

- Cada frequência deve referenciar um aluno e uma aula existentes.
- Somente turmas válidas podem ser usadas no registro de frequência.
- A taxa de presença deve ser calculada a partir de registros confirmados.
