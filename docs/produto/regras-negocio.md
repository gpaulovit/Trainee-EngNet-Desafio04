# Regras de Negócio

- Um professor autorizado deve autenticar-se antes de registrar presença.
- Cada turma possui código único e horários definidos.
- A presença deve ser registrada por aluno para cada aula.
- Ausências são computadas automaticamente na taxa de presença.
- Relatórios devem considerar apenas aulas já realizadas.
- Alunos não podem alterar presença após confirmação do professor.
- Professores podem visualizar apenas suas turmas ou turmas autorizadas.
- Administrador pode cadastrar turmas, alunos e gerar relatórios completos.

## Dados Principais

- Aluno: nome, matrícula, turma, email.
- Turma: nome, código, horário, curso, professor responsável.
- Aula: turma, data, hora de início/fim, tipo de prática.
- Frequência: aluno, aula, status (presença/falta), registro.
