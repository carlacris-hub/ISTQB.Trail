import { Chapter, Question, Lesson } from '../types';
import { EN_CHAPTER_OVERLAY, EN_QUESTIONS_MAP } from './enTranslations';

// Helper generator to build 15 structured lessons per chapter with bilingual readiness
const createLessonsForChapter = (chapterId: number, baseTopic: string, lessonsData: { title: string; summary: string; text: string; points?: string[]; tip?: string }[]): Lesson[] => {
  return lessonsData.map((d, index) => ({
    id: `l${chapterId}_${index + 1}`,
    chapterId,
    title: `${index + 1}. ${d.title}`,
    summary: d.summary,
    xpReward: 20,
    content: [
      {
        sectionTitle: `Conceito Oficial - CTFL v4.0.1 (${baseTopic})`,
        text: d.text,
        bulletPoints: d.points,
        tip: d.tip || `Requisito da certificação ISTQB CTFL v4.0.1 - Estudo essencial para a prova oficial.`,
      }
    ]
  }));
};

export const ISTQB_CHAPTERS: Chapter[] = [
  // CHAPTER 1
  {
    id: 1,
    title: 'Capítulo 1: Fundamentos da Testagem',
    subtitle: 'Conceitos Básicos, Princípios e Processo de Teste',
    description: 'Entenda o que é testagem, por que ela é necessária, os 7 princípios fundamentais e as atividades do processo de teste.',
    iconName: 'ShieldCheck',
    color: 'from-emerald-500 to-teal-600',
    syllabusReference: 'ISTQB CTFL v4.0 - Seção 1 (180 min)',
    badge: {
      id: 'badge_ch1',
      name: 'Guardião da Qualidade',
      description: 'Dominou os conceitos fundamentais e os 7 princípios de teste.',
      icon: 'Shield',
    },
    lessons: createLessonsForChapter(1, 'Fundamentos', [
      {
        title: 'O que é Teste de Software?',
        summary: 'Entenda que teste vai muito além da simples execução de código.',
        text: 'O teste de software é um conjunto de atividades para descobrir defeitos e avaliar a qualidade dos produtos de trabalho. Inclui planejamento, análise, design, implementação, execução e encerramento.',
        points: [
          'Avaliadores de Qualidade: Testes fornecem métricas cruciais para tomadas de decisão de lançamento.',
          'Objetos de Teste: Qualquer artefato testável (requisitos, código, diagramas, manuais).',
          'Processo Contínuo: Deve ser alinhado ao ciclo de vida de desenvolvimento de software (SDLC).'
        ]
      },
      {
        title: 'Objetivos Típicos do Teste',
        summary: 'Identifique as principais metas da atividade de testes.',
        text: 'Os objetivos variam conforme o contexto do projeto, o nível de risco e a fase do desenvolvimento.',
        points: [
          'Avaliar produtos de trabalho como requisitos, user stories e código.',
          'Causar falhas e encontrar defeitos para reduzir riscos.',
          'Garantir a cobertura necessária da base de teste.',
          'Validar se o sistema atende às necessidades dos usuários e requisitos contratuais.'
        ]
      },
      {
        title: 'Testar versus Depurar (Debugging)',
        summary: 'Compreenda a separação entre encontrar um defeito e corrigi-lo.',
        text: 'Testar e depurar são atividades distintas. O teste identifica a falha ou o defeito. A depuração (debugging) é a atividade de desenvolvimento para localizar, analisar e corrigir a causa-raiz no código.',
        points: [
          'Teste Dinâmico: Revela falhas causadas por defeitos.',
          'Depuração: Reproduz a falha, diagnostica o código e corrige o bug.',
          'Teste de Confirmação: Realizado após a depuração para verificar se a correção funcionou.'
        ]
      },
      {
        title: 'Por que o Teste é Necessário?',
        summary: 'Contribuições do teste para o sucesso dos projetos e redução de custos.',
        text: 'Software com falhas pode causar perdas financeiras, danos de reputação, ferimentos ou até morte em sistemas críticos. O teste rigoroso previne desastres e assegura a qualidade.',
        points: [
          'Detecção Precoce: Encontrar bugs no início custa até 100x menos do que em produção.',
          'Representação do Usuário: Testers garantem que as necessidades reais do cliente sejam consideradas.',
          'Conformidade Legal: Atendimento a normas e regulamentações do setor.'
        ]
      },
      {
        title: 'Teste e Garantia da Qualidade (QA)',
        summary: 'Aprenda a diferença entre Teste (QC) e Quality Assurance (QA).',
        text: 'Embora usados como sinônimos, QA e Teste são conceitos diferentes. QA foca no processo preventivo, enquanto o teste foca no produto (corretivo).',
        points: [
          'QA (Garantia da Qualidade): Focado no PROCESSO. Previne defeitos melhorando os métodos de trabalho.',
          'Teste (Controle da Qualidade): Focado no PRODUTO. Detecta e reporta defeitos nos artefatos gerados.'
        ]
      },
      {
        title: 'Erros, Defeitos, Falhas e Causas-Raiz',
        summary: 'Definições estritas do Glossário Oficial ISTQB.',
        text: 'Compreender a cadeia de causalidade é fundamental para o exame oficial:',
        points: [
          'Erro (Engano): Ação humana incorreta (ex: distração do programador).',
          'Defeito (Bug/Imperfeição): Imperfeição no código ou documento causada pelo erro.',
          'Falha: Desvio do comportamento esperado durante a execução.',
          'Causa-Raiz: A razão primária que levou ao erro humano (ex: falta de treinamento).'
        ]
      },
      {
        title: 'Princípio 1: O Teste mostra a presença de defeitos',
        summary: 'Testar demonstra que há bugs, mas não garante a ausência deles.',
        text: 'Testes podem provar que existem defeitos no software, mas não conseguem provar que o software está 100% livre de falhas.',
        tip: 'Mesmo que nenhum bug seja encontrado em uma bateria de testes, não significa que o software é perfeito!'
      },
      {
        title: 'Princípio 2: Testes Exaustivos são Impossíveis',
        summary: 'Não é viável testar todas as combinações de dados e cenários.',
        text: 'Testar tudo (todas as entradas e caminhos) só é possível em casos triviais. Portanto, usamos técnicas de teste, priorização e análise de risco para focar o esforço onde importa.',
      },
      {
        title: 'Princípio 3: Teste Precoce (Shift-Left)',
        summary: 'Inicie os testes o quanto antes no ciclo de vida.',
        text: 'O teste deve começar logo no início do SDLC (revisão de requisitos e histórias de usuário) para identificar e corrigir falhas antes que sejam codificadas.',
      },
      {
        title: 'Princípio 4: Agrupamento de Defeitos (Pareto)',
        summary: 'A maioria dos defeitos se concentra em poucos módulos.',
        text: 'Segundo o Princípio de Pareto (80/20), um pequeno número de componentes geralmente contém a maior parte dos defeitos descobertos no sistema.',
      },
      {
        title: 'Princípios 5, 6 e 7 de Teste',
        summary: 'Paradoxo do Pesticida, Dependência de Contexto e Ilusão de Ausência de Erros.',
        text: 'Os últimos três princípios completam as regras de ouro:',
        points: [
          '5. Paradoxo do Pesticida: Testes repetidos perdem a eficácia. Os casos de teste devem ser atualizados regularmente.',
          '6. O Teste depende do contexto: Testar um e-commerce é diferente de testar um dispositivo médico.',
          '7. A Ilusão da ausência de erros: Corrigir todos os bugs não garante sucesso se o sistema não atender às necessidades do usuário.'
        ]
      },
      {
        title: 'Atividades do Processo de Teste: Planejamento e Monitoramento',
        summary: 'As atividades de governança e controle do teste.',
        text: 'O Planejamento define escopo, objetivos e abordagem. O Monitoramento compara o progresso real com o planejado, aplicando Controle para redirecionar ações quando necessário.',
      },
      {
        title: 'Atividades de Análise, Design e Implementação',
        summary: 'Transformando a base de teste em casos e scripts executáveis.',
        text: 'Na Análise identifica-se O QUE testar. No Design define-se COMO testar (casos de teste e dados). Na Implementação criam-se scripts e prepara-se o ambiente de teste.',
      },
      {
        title: 'Atividades de Execução e Conclusão de Teste',
        summary: 'Rodando os testes, registrando defeitos e fechando o ciclo.',
        text: 'A Execução compara resultados reais vs esperados e reporta anomalias. Na Conclusão, analisa-se os critérios de saída, arquivam-se os testes e compilam-se lições aprendidas.',
      },
      {
        title: 'Rastreabilidade e Papéis no Teste',
        summary: 'A importância da rastreabilidade e a distinção entre Papel de Gestão e Papel Técnico.',
        text: 'A Rastreabilidade entre a Base de Teste (requisitos) e o Testware garante a avaliação da cobertura. Os papéis principais são: Líder/Gerente de Teste (foco em gestão) e Tester (foco em engenharia técnica).',
      }
    ]),
    quizQuestions: [
      {
        id: 'q1_1',
        chapterId: 1,
        chapterTitle: 'Fundamentos da Testagem',
        taxonomy: 'K1',
        stem: 'Qual das seguintes opções descreve corretamente a relação entre erro, defeito e falha conforme o Glossário ISTQB?',
        options: [
          'Um erro humano gera um defeito no código, que quando executado pode causar uma falha.',
          'Uma falha cometida pelo desenvolvedor gera um erro no código, causando um defeito no sistema.',
          'Um defeito é cometido por um ser humano, gerando uma falha no código e um erro em produção.',
          'Erro, defeito e falha são sinônimos exatos na engenharia de software.'
        ],
        correctIndex: 0,
        explanation: 'Erros (enganos humanos) resultam em defeitos (bugs nos artefatos). Se esse defeito for executado, pode manifestar-se como uma falha.'
      },
      {
        id: 'q1_2',
        chapterId: 1,
        chapterTitle: 'Fundamentos da Testagem',
        taxonomy: 'K2',
        stem: 'Qual princípio de teste afirma que repetir a mesma bateria de testes continuamente reduzirá sua capacidade de encontrar novos defeitos?',
        options: [
          'Agrupamento de defeitos',
          'O paradoxo do pesticida',
          'A ilusão da ausência de erros',
          'Testes exaustivos são impossíveis'
        ],
        correctIndex: 1,
        explanation: 'O Paradoxo do Pesticida estabelece que testes repetidos perdem a eficácia e precisam ser revisados periodicamente.'
      },
      {
        id: 'q1_3',
        chapterId: 1,
        chapterTitle: 'Fundamentos da Testagem',
        taxonomy: 'K2',
        stem: 'Qual atividade do processo de teste envolve comparar os resultados reais obtidos com os resultados esperados especificados?',
        options: [
          'Análise de Teste',
          'Design de Teste',
          'Execução de Teste',
          'Planejamento de Teste'
        ],
        correctIndex: 2,
        explanation: 'Durante a Execução de Teste, executam-se os scripts e comparam-se os resultados reais com os esperados.'
      },
      {
        id: 'q1_4',
        chapterId: 1,
        chapterTitle: 'Fundamentos da Testagem',
        taxonomy: 'K2',
        stem: 'Sobre QA (Garantia da Qualidade) e Testes (Controle da Qualidade), assinale a afirmativa correta:',
        options: [
          'QA é focado no produto e Teste é focado no processo.',
          'QA é um processo preventivo focado em melhorar os processos de desenvolvimento, enquanto o Teste foca em detectar defeitos no produto.',
          'Ambos significam exatamente a mesma coisa no contexto do ISTQB v4.0.',
          'O teste substitui a necessidade de QA em projetos ágeis.'
        ],
        correctIndex: 1,
        explanation: 'QA é orientado a processo e prevenção; Testes (QC) são orientados a produto e correção.'
      }
    ]
  },

  // CHAPTER 2
  {
    id: 2,
    title: 'Capítulo 2: Teste ao Longo do Ciclo de Vida (SDLC)',
    subtitle: 'Níveis de Teste, Tipos de Teste e Manutenção',
    description: 'Aprenda como os testes se integram aos modelos de desenvolvimento (Cascata, Ágil, DevOps), os 5 níveis de teste e os tipos de teste.',
    iconName: 'Layers',
    color: 'from-blue-500 to-indigo-600',
    syllabusReference: 'ISTQB CTFL v4.0 - Seção 2 (130 min)',
    badge: {
      id: 'badge_ch2',
      name: 'Arquiteto de Níveis',
      description: 'Mestre na aplicação dos níveis e tipos de teste ao longo do SDLC.',
      icon: 'Layers',
    },
    lessons: createLessonsForChapter(2, 'Ciclo de Vida (SDLC)', [
      {
        title: 'O Teste no Contexto do SDLC',
        summary: 'Como o modelo de desenvolvimento escolhido afeta as atividades de teste.',
        text: 'O modelo de ciclo de vida de desenvolvimento de software (SDLC) define o momento e a abordagem das atividades de teste. Em modelos sequenciais (Cascata, V-Model), o teste dinâmico ocorre mais tarde; em modelos ágeis e iterativos, o teste ocorre em cada sprint/incremento.',
      },
      {
        title: 'Boas Práticas de Teste em Qualquer SDLC',
        summary: 'Princípios de qualidade universais independentes da metodologia.',
        text: 'Para cada atividade de desenvolvimento existe uma atividade correspondente de teste. Além disso, cada nível de teste possui seus próprios objetivos específicos para evitar redundâncias.',
      },
      {
        title: 'Desenvolvimento Dirigido por Testes (TDD, ATDD, BDD)',
        summary: 'Abordagens "Test-First" onde os testes guiam a codificação.',
        text: 'No TDD (Test-Driven Development), escreve-se o teste unitário antes do código. No ATDD (Acceptance TDD), os testes de aceitação são criados antes do desenvolvimento. No BDD (Behavior-Driven Development), usa-se linguagem natural (Dado/Quando/Então).',
      },
      {
        title: 'DevOps e Testes Contínuos',
        summary: 'Automação e cultura de integração contínua (CI/CD).',
        text: 'DevOps integra desenvolvimento e operações. Promove feedback rápido através de pipelines CI/CD com testes automatizados executados a cada submissão de código.',
      },
      {
        title: 'O Princípio Shift-Left na Prática',
        summary: 'Move as atividades de teste para as fases iniciais do projeto.',
        text: 'Shift-Left inclui revisar especificações antes da codificação, criar testes de unidade preventivos e realizar análise estática antes da execução dinâmica.',
      },
      {
        title: 'Retrospectivas e Melhoria de Processos',
        summary: 'Aprender com cada ciclo para aprimorar a qualidade.',
        text: 'Retrospectivas ao final das iterações identificam o que funcionou bem e o que precisa ser melhorado na estratégia de teste e na qualidade dos artefatos.',
      },
      {
        title: 'Nível 1: Teste de Componente (Unidade)',
        summary: 'Testando módulos individuais em isolamento.',
        text: 'Focado em isolar e testar pequenos pedaços de código (funções, classes). Geralmente realizado por desenvolvedores utilizando frameworks de testes unitários e stubs/mocks.',
      },
      {
        title: 'Nível 2: Teste de Integração de Componentes',
        summary: 'Testando as interações e interfaces entre módulos.',
        text: 'Avalia a comunicação e transferência de dados entre componentes individuais após o teste de unidade.',
      },
      {
        title: 'Nível 3: Teste de Sistema',
        summary: 'Avaliando o comportamento do sistema completo e integrado.',
        text: 'Avalia o produto como um todo contra os requisitos funcionais e não funcionais em um ambiente representativo.',
      },
      {
        title: 'Nível 4: Teste de Integração de Sistemas',
        summary: 'Testando a integração do sistema com sistemas externos e APIs.',
        text: 'Verifica se o produto se comunica corretamente com serviços de terceiros, bancos de dados externos ou microserviços.',
      },
      {
        title: 'Nível 5: Teste de Aceitação (UAT, OAT, Alpha/Beta)',
        summary: 'Validação final de prontidão para implantação.',
        text: 'Focado em demonstrar que o sistema atende às necessidades de negócio do usuário final. Inclui UAT (usuário), OAT (operacional) e testes Alpha/Beta.',
      },
      {
        title: 'Tipos de Teste: Teste Funcional',
        summary: 'Avaliando O QUE o sistema faz.',
        text: 'Testes funcionais avaliam as funções que o sistema deve executar, verificando adequação, precisão e conformidade funcional.',
      },
      {
        title: 'Tipos de Teste: Teste Não-Funcional (ISO 25010)',
        summary: 'Avaliando COMO BEM o sistema se comporta.',
        text: 'Mede atributos de qualidade como desempenho, usabilidade, segurança, confiabilidade, mantibilidade e portabilidade.',
      },
      {
        title: 'Teste de Confirmação versus Teste de Regressão',
        summary: 'Dois conceitos essenciais para verificar alterações no sistema.',
        text: 'Teste de Confirmação (Re-teste): Verifica se um defeito específico foi corrigido. Teste de Regressão: Verifica se a mudança não causou novos bugs em partes inalteradas.',
      },
      {
        title: 'Teste de Manutenção e seus Gatilhos',
        summary: 'Testando sistemas em operação que sofreram modificações.',
        text: 'Executado após alterações em ambiente de produção. Gatilhos: modificações (melhorias/hotfixes), migrações de plataforma ou desativação/arquivamento de sistemas.',
      }
    ]),
    quizQuestions: [
      {
        id: 'q2_1',
        chapterId: 2,
        chapterTitle: 'Teste ao Longo do SDLC',
        taxonomy: 'K2',
        stem: 'Qual a principal diferença entre Teste de Confirmação e Teste de Regressão?',
        options: [
          'O teste de confirmação é automatizado; o teste de regressão é sempre manual.',
          'O teste de confirmação verifica se uma falha específica foi corrigida; o de regressão garante que partes inalteradas não foram afetadas.',
          'O teste de regressão ocorre antes do desenvolvimento; a confirmação ocorre no aceite do cliente.',
          'Não há diferença; ambos são termos idênticos no ISTQB CTFL v4.0.1.'
        ],
        correctIndex: 1,
        explanation: 'Confirmação valida a correção do bug específico; Regressão previne efeitos colaterais em outras partes do sistema.'
      },
      {
        id: 'q2_2',
        chapterId: 2,
        chapterTitle: 'Teste ao Longo do SDLC',
        taxonomy: 'K2',
        stem: 'No BDD (Behavior-Driven Development), qual formato de linguagem natural é comumente utilizado para expressar os casos de teste?',
        options: [
          'Dado / Quando / Então (Given / When / Then)',
          'Planejar / Executar / Checar / Agir (PDCA)',
          'Entrada / Processamento / Saída',
          'Ator / Ação / Resultado Espetacular'
        ],
        correctIndex: 0,
        explanation: 'BDD utiliza o formato Dado (contexto), Quando (ação), Então (resultado esperado).'
      }
    ]
  },

  // CHAPTER 3
  {
    id: 3,
    title: 'Capítulo 3: Testes Estáticos',
    subtitle: 'Revisões, Análise Estática e Processo de Revisão',
    description: 'Descubra o valor dos testes estáticos (sem execução de código), os papéis em revisões e os tipos de revisão (Informal, Walkthrough, Técnica, Inspeção).',
    iconName: 'FileText',
    color: 'from-amber-500 to-orange-600',
    syllabusReference: 'ISTQB CTFL v4.0 - Seção 3 (80 min)',
    badge: {
      id: 'badge_ch3',
      name: 'Inspetor Crítico',
      description: 'Especialista em encontrar defeitos em documentos e código via testes estáticos.',
      icon: 'Search',
    },
    lessons: createLessonsForChapter(3, 'Testes Estáticos', [
      {
        title: 'Conceitos Básicos de Testes Estáticos',
        summary: 'Exame de artefatos sem executar o código.',
        text: 'Testes estáticos avaliam produtos de trabalho (requisitos, histórias, arquitetura, código) manualmente (revisões) ou via ferramentas (análise estática).',
      },
      {
        title: 'Produtos de Trabalho Examináveis',
        summary: 'O que pode ser submetido a testes estáticos.',
        text: 'Praticamente qualquer documento ou código que possa ser lido: especificações de requisitos, backlog, contratos, modelos e código-fonte.',
      },
      {
        title: 'Valor dos Testes Estáticos',
        summary: 'Encontrar bugs no momento mais barato do projeto.',
        text: 'Detectar defeitos em requisitos reduz drasticamente os custos de retrabalho, melhora a comunicação e constrói um entendimento compartilhado entre os stakeholders.',
      },
      {
        title: 'Diferenças entre Teste Estático e Teste Dinâmico',
        summary: 'Como essas duas abordagens se complementam.',
        text: 'O teste estático encontra DEFEITOS diretamente no texto/código. O teste dinâmico causa FALHAS durante a execução do programa.',
      },
      {
        title: 'Benefícios do Feedback Precoce dos Stakeholders',
        summary: 'Evitando mal-entendidos antes da codificação.',
        text: 'Obter feedback rápido dos clientes e gerentes previne que o time desenvolva funcionalidades erradas por interpretação incorreta de requisitos.',
      },
      {
        title: 'Fase 1 do Processo de Revisão: Planejamento',
        summary: 'Definindo o escopo, objetivos e critérios de saída.',
        text: 'No Planejamento, escolhe-se o tipo de revisão, alocam-se recursos e definem-se os critérios de entrada e saída.',
      },
      {
        title: 'Fase 2 do Processo de Revisão: Iniciação',
        summary: 'Preparando todos os participantes para a revisão.',
        text: 'Garante que os revisores tenham acesso aos documentos, conheçam seus papéis e recebam as instruções necessárias.',
      },
      {
        title: 'Fase 3 do Processo de Revisão: Revisão Individual',
        summary: 'Avaliando o produto de trabalho de forma independente.',
        text: 'Cada revisor analisa o documento separadamente, identificando anomalias, dúvidas e sugestões usando listas de verificação (checklists).',
      },
      {
        title: 'Fase 4 do Processo de Revisão: Comunicação e Análise',
        summary: 'Discutindo e catalogando os achados na reunião de revisão.',
        text: 'O time se reúne para analisar as anomalias reportadas, decidindo se são defeitos reais e quais ações corretivas devem ser tomadas.',
      },
      {
        title: 'Fase 5 do Processo de Revisão: Correção e Relatório',
        summary: 'Acompanhando a solução de cada defeito.',
        text: 'O autor corrige os defeitos encontrados e o Líder de Revisão verifica se os critérios de saída foram atingidos.',
      },
      {
        title: 'Papéis em Revisões: Gerente e Autor',
        summary: 'Responsabilidades do patrocinador e do criador do artefato.',
        text: 'O Gerente decide o que será revisado e fornece tempo/recursos. O Autor cria e corrige o produto de trabalho.',
      },
      {
        title: 'Papéis em Revisões: Moderador (Facilitador) e Escrevente (Scribe)',
        summary: 'Garantindo a condução neutra e o registro das anomalias.',
        text: 'O Moderador garante a eficácia das reuniões e clima seguro. O Escrevente registra as anomalias e decisões tomadas.',
      },
      {
        title: 'Papéis em Revisões: Revisor e Líder de Revisão',
        summary: 'Avaliação técnica e liderança geral do processo.',
        text: 'O Revisor inspeciona o artefato. O Líder de Revisão assume a responsabilidade geral pelo agendamento e sucesso da revisão.',
      },
      {
        title: 'Tipos de Revisão: Informal e Walkthrough',
        summary: 'Dois formatos de baixa/média formalidade.',
        text: 'Revisão Informal: Sem processo rígido (ex: peer review rápido). Walkthrough: Conduzida pelo autor para explicar o produto e obter ideias do time.',
      },
      {
        title: 'Tipos de Revisão: Técnica e Inspeção',
        summary: 'Formatos formais com alta capacidade de detecção de defeitos.',
        text: 'Revisão Técnica: Conduzida por especialistas treinados com foco em soluções técnicas. Inspeção: O tipo MAIS FORMAL, com métricas, checklists rigorosos e escrevente dedicado.',
      }
    ]),
    quizQuestions: [
      {
        id: 'q3_1',
        chapterId: 3,
        chapterTitle: 'Testes Estáticos',
        taxonomy: 'K2',
        stem: 'Qual dos seguintes tipos de revisão é o mais formal, utiliza métricas e exige a presença de papéis como Moderador e Escrevente?',
        options: [
          'Revisão Informal',
          'Walkthrough',
          'Inspeção',
          'Revisão de Pares Síncrona'
        ],
        correctIndex: 2,
        explanation: 'A Inspeção é o tipo mais formal de revisão no ISTQB, seguindo todas as fases e papéis estritos.'
      }
    ]
  },

  // CHAPTER 4
  {
    id: 4,
    title: 'Capítulo 4: Análise e Design de Testes',
    subtitle: 'Técnicas Caixa-Preta, Caixa-Branca e Baseadas na Experiência',
    description: 'Aprenda a Derivar casos de teste usando Particionamento de Equivalência, BVA, Tabela de Decisão, Transição de Estados, Cobertura de Instrução/Ramo e Teste Exploratório.',
    iconName: 'Target',
    color: 'from-purple-500 to-pink-600',
    syllabusReference: 'ISTQB CTFL v4.0 - Seção 4 (390 min)',
    badge: {
      id: 'badge_ch4',
      name: 'Estrategista de Casos de Teste',
      description: 'Mestre no cálculo de partições, valores limite e cobertura de código.',
      icon: 'Award',
    },
    lessons: createLessonsForChapter(4, 'Análise e Design', [
      {
        title: 'Visão Geral das Técnicas de Teste',
        summary: 'Classificação das técnicas: Caixa-Preta, Caixa-Branca e Experiência.',
        text: 'Técnicas de teste ajudam a desenvolver um conjunto pequeno, porém eficaz, de casos de teste. Dividem-se em baseadas na especificação (caixa-preta), na estrutura (caixa-branca) e no conhecimento do testador (experiência).',
      },
      {
        title: 'Caixa-Preta: Particionamento de Equivalência (EP)',
        summary: 'Dividindo o domínio de dados em partições válidas e inválidas.',
        text: 'O EP divide os dados em partições onde se espera que o sistema processe todos os elementos de forma idêntica. Testa-se um valor representativo de cada partição.',
      },
      {
        title: 'Cálculo de Cobertura em Particionamento de Equivalência',
        summary: 'Como medir a porcentagem de partições exercitadas.',
        text: 'Cobertura EP = (Número de partições testadas / Número total de partições identificadas) x 100%. Deve-se testar partições inválidas isoladamente para evitar mascaramento de defeitos.',
      },
      {
        title: 'Caixa-Preta: Análise do Valor Limite (BVA - 2 Valores)',
        summary: 'Focando nos limites das partições ordenadas.',
        text: 'Erros ocorrem com maior frequência nos limites das partições. No BVA de 2 valores, escolhe-se o valor exato do limite e seu vizinho imediato na partição adjacente.',
      },
      {
        title: 'Análise do Valor Limite (BVA - 3 Valores)',
        summary: 'Testes mais rigorosos considerando ambos os vizinhos do limite.',
        text: 'No BVA de 3 valores, testa-se o valor limite, o vizinho imediatamente abaixo e o vizinho imediatamente acima. Garante maior rigor em sistemas críticos.',
      },
      {
        title: 'Caixa-Preta: Tabela de Decisão',
        summary: 'Modelando regras de negócio complexas com combinações de condições.',
        text: 'Ideal para testar combinações de condições lógicas. Cada coluna representa uma regra de negócio com condições (Verdadeiro/Falso) e ações correspondentes.',
      },
      {
        title: 'Simplificação e Minimização de Tabelas de Decisão',
        summary: 'Eliminando colunas inviáveis para otimizar os testes.',
        text: 'Colunas com combinações impossíveis de condições podem ser descartadas, reduzindo a complexidade sem perder a cobertura de riscos.',
      },
      {
        title: 'Caixa-Preta: Teste de Transição de Estados',
        summary: 'Modelando sistemas que mudam de estado com eventos.',
        text: 'Aplica-se quando o comportamento do sistema depende do estado atual e do histórico anterior (ex: login com 3 tentativas bloqueadas).',
      },
      {
        title: 'Critérios de Cobertura em Transição de Estados',
        summary: 'Cobertura de todos os estados vs todas as transições válidas.',
        text: 'Cobertura de Todos os Estados: Garante que cada estado seja visitado ao menos uma vez. Cobertura de Transições Válidas (0-switch): Garante que cada transição válida seja executada.',
      },
      {
        title: 'Caixa-Branca: Teste de Instrução (Statement Testing)',
        summary: 'Medindo a porcentagem de instruções do código executadas.',
        text: 'O objetivo é exercitar as linhas de código executáveis. Cobertura de Instrução = (Instruções executadas / Total de instruções) x 100%.',
      },
      {
        title: 'Caixa-Branca: Teste de Ramo (Branch Testing)',
        summary: 'Garantindo que todos os desvios condicionais (True/False) sejam testados.',
        text: 'Exercita as ramificações de decisões (if/else, switch/case). A cobertura de ramo engloba 100% da cobertura de instrução.',
      },
      {
        title: 'Valor dos Testes Caixa-Branca',
        summary: 'Identificando código morto e caminhos não documentados.',
        text: 'Garante a avaliação objetiva da estrutura interna do código, embora não consiga identificar requisitos omitidos que não foram codificados.',
      },
      {
        title: 'Técnicas Baseadas na Experiência: Suposição de Erro (Error Guessing)',
        summary: 'Antecipando bugs com base no conhecimento do testador.',
        text: 'O testador antecipa erros comuns de desenvolvedores com base no histórico e utiliza ataques de falhas para testar o sistema.',
      },
      {
        title: 'Técnicas Baseadas na Experiência: Teste Exploratório',
        summary: 'Design, execução e aprendizado simultâneos.',
        text: 'Muito útil quando há pouca documentação ou pressão de tempo. Frequentemente estruturado em sessões temporizadas usando Charters de Teste.',
      },
      {
        title: 'Técnicas Baseadas na Experiência: Teste Baseado em Listas de Verificação',
        summary: 'Guia de verificação baseado em lições aprendidas.',
        text: 'O testador executa testes guiados por uma checklist de condições ou diretrizes pré-definidas para garantir consistência.',
      }
    ]),
    quizQuestions: [
      {
        id: 'q4_1',
        chapterId: 4,
        chapterTitle: 'Análise e Design de Testes',
        taxonomy: 'K3',
        stem: 'Um campo de idade aceita valores válidos de 18 a 60 anos. Utilizando a Análise do Valor Limite de 2 Valores (2-value BVA), quais valores devem ser testados para cobrir os limites inferiores e superiores?',
        options: [
          '17, 18, 60 e 61',
          '18, 19, 59 e 60',
          '0, 18, 60 e 100',
          '17, 18, 19, 59, 60 e 61'
        ],
        correctIndex: 0,
        explanation: 'No 2-value BVA, para o limite 18 testa-se {17, 18}; para o limite 60 testa-se {60, 61}.'
      }
    ]
  },

  // CHAPTER 5
  {
    id: 5,
    title: 'Capítulo 5: Gestão das Atividades de Teste',
    subtitle: 'Planejamento, Estimativa, Riscos, Métricas e Defect Management',
    description: 'Aprenda sobre Plano de Teste, Critérios de Entrada/Saída, Pirâmide de Teste, Quadrantes de Teste, Gestão de Riscos de Produto e Relatórios de Defeitos.',
    iconName: 'TrendingUp',
    color: 'from-rose-500 to-red-600',
    syllabusReference: 'ISTQB CTFL v4.0 - Seção 5 (335 min)',
    badge: {
      id: 'badge_ch5',
      name: 'Gerente de Qualidade',
      description: 'Mestre na governança, análise de riscos e métricas de teste.',
      icon: 'TrendingUp',
    },
    lessons: createLessonsForChapter(5, 'Gestão de Testes', [
      {
        title: 'Propósito e Conteúdo do Plano de Teste',
        summary: 'O documento mestre que guia a estratégia de qualidade.',
        text: 'O Plano de Teste descreve os objetivos, recursos, cronograma, estratégia, riscos e processos para o projeto de teste (conforme a norma ISO/IEC/IEEE 29119-3).',
      },
      {
        title: 'Contribuição do Testador no Planejamento de Release e Iteração',
        summary: 'Atuação do tester em equipes ágeis.',
        text: 'No planejamento da release, o tester ajuda a definir histórias testáveis e critérios de aceite. Na iteração, detalha tarefas de teste e estimativas.',
      },
      {
        title: 'Critérios de Entrada e Critérios de Saída (DoR e DoD)',
        summary: 'Condições para iniciar e concluir atividades de teste.',
        text: 'Critérios de Entrada (Definition of Ready): Pré-condições para começar o teste. Critérios de Saída (Definition of Done): Métricas necessárias para declarar o teste concluído.',
      },
      {
        title: 'Técnicas de Estimativa de Esforço: Relação e Extrapolação',
        summary: 'Estimativas baseadas em métricas históricas.',
        text: 'Por Relação: Usa proporções históricas (ex: dev:teste = 3:2). Por Extrapolação: Mede o ritmo das primeiras iterações para projetar o trabalho restante.',
      },
      {
        title: 'Técnicas de Estimativa de Esforço: Wideband Delphi e 3 Pontos',
        summary: 'Estimativas baseadas na opinião de especialistas.',
        text: 'Wideband Delphi (Planning Poker): Consenso em grupo. Estimativa de 3 Pontos: E = (a + 4m + b) / 6, onde a = otimista, m = mais provável, b = pessimista.',
      },
      {
        title: 'Estratégias de Priorização de Casos de Teste',
        summary: 'Definindo a ordem ideal de execução dos testes.',
        text: 'Pode ser baseada em Risco (testes de maior risco primeiro), Cobertura (maior cobertura primeiro) ou Prioridade de Requisitos informada pelo negócio.',
      },
      {
        title: 'A Pirâmide de Testes',
        summary: 'Modelo visual de distribuição do esforço e automação.',
        text: 'Base da pirâmide: Testes unitários (muitos, rápidos, baratos). Meio: Testes de serviço/integração. Topo: Testes de UI/E2E (poucos, lentos, mais caros).',
      },
      {
        title: 'Os Quadrantes de Teste (Brian Marick)',
        summary: 'Categorizando testes por foco (Tecnologia/Negócio) e objetivo.',
        text: 'Q1: Voltado à tecnologia e suporte ao time (Unitários). Q2: Voltado ao negócio e suporte ao time (Funcionais). Q3: Voltado ao negócio e crítica ao produto (Exploratórios). Q4: Voltado à tecnologia e crítica (Desempenho/Segurança).',
      },
      {
        title: 'Definição e Atributos de Risco',
        summary: 'Entendendo a probabilidade e o impacto de eventos indesejados.',
        text: 'Risco é um evento potencial que pode causar um efeito adverso. Nível de Risco = Probabilidade (Likelihood) x Impacto (Harm).',
      },
      {
        title: 'Riscos de Projeto versus Riscos de Produto',
        summary: 'Diferenciando problemas de gestão de falhas de qualidade.',
        text: 'Riscos de Projeto: Atrasos, falta de pessoal, corte de orçamento. Riscos de Produto: Falhas na funcionalidade, baixa performance, vulnerabilidades de segurança.',
      },
      {
        title: 'Análise de Risco do Produto e Testes Baseados em Risco',
        summary: 'Usando o risco para guiar a profundidade e o escopo dos testes.',
        text: 'Testes baseados em risco priorizam as funcionalidades com maior nível de risco para garantir que os bugs críticos sejam encontrados primeiro.',
      },
      {
        title: 'Monitoramento, Controle e Métricas de Teste',
        summary: 'Acompanhando o progresso com indicadores objetivos.',
        text: 'Métricas comuns: taxa de execução de testes, taxa de defeitos abertos/corrigidos, cobertura de requisitos e densidade de bugs.',
      },
      {
        title: 'Relatórios de Progresso e Conclusão de Teste',
        summary: 'Comunicando o status da qualidade aos stakeholders.',
        text: 'Relatório de Progresso: Status diário/semanal durante a execução. Relatório de Conclusão: Resumo ao final do projeto detalhando se o produto está pronto para produção.',
      },
      {
        title: 'Gestão de Configuração no Teste',
        summary: 'Rastreabilidade e versionamento de artefatos de teste.',
        text: 'Garante que todos os itens de teste (scripts, dados, ambientes) sejam identificados e versionados de forma única e reproduzível.',
      },
      {
        title: 'Gestão de Defeitos e Estrutura do Relatório de Bug',
        summary: 'Como reportar anomalias de forma clara e acionável.',
        text: 'Um bom relatório de defeito inclui: Título claro, Passos para reproduzir, Resultado esperado, Resultado real, Severidade, Prioridade e Logs/Screenshots.',
      }
    ]),
    quizQuestions: [
      {
        id: 'q5_1',
        chapterId: 5,
        chapterTitle: 'Gestão de Testes',
        taxonomy: 'K2',
        stem: 'Na técnica de estimativa de 3 pontos, se a estimativa otimista é de 6 horas, a mais provável é de 9 horas e a pessimista é de 18 horas, qual é a estimativa final esperada (E)?',
        options: [
          '10 horas',
          '11 horas',
          '9 horas',
          '12 horas'
        ],
        correctIndex: 0,
        explanation: 'E = (6 + 4*9 + 18) / 6 = (6 + 36 + 18) / 6 = 60 / 6 = 10 horas.'
      }
    ]
  },

  // CHAPTER 6
  {
    id: 6,
    title: 'Capítulo 6: Ferramentas de Teste',
    subtitle: 'Suporte por Ferramentas, Benefícios e Riscos da Automação',
    description: 'Entenda a classificação das ferramentas de teste, os benefícios da automação e os riscos envolvidos no uso de ferramentas.',
    iconName: 'Wrench',
    color: 'from-cyan-500 to-blue-600',
    syllabusReference: 'ISTQB CTFL v4.0 - Seção 6 (20 min)',
    badge: {
      id: 'badge_ch6',
      name: 'Mestre em Automação',
      description: 'Conhecedor das ferramentas de teste, benefícios e riscos da automação.',
      icon: 'Zap',
    },
    lessons: createLessonsForChapter(6, 'Ferramentas de Teste', [
      {
        title: 'Classificação das Ferramentas de Teste',
        summary: 'Ferramentas de gestão, teste estático, design e execução.',
        text: 'Ferramentas apoiam as atividades de teste ao longo de todo o SDLC: Gestão de Testes/Defeitos, Teste Estático (Linters), Design/Geração de Dados e Execução/Automação.',
      },
      {
        title: 'Ferramentas de Teste Estático e Análise de Código',
        summary: 'Detecção automática de vulnerabilidades e padrões de código.',
        text: 'Analisadores estáticos examinam o código sem executá-lo para encontrar violações de padrões de codificação, falhas de segurança e código inacessível.',
      },
      {
        title: 'Ferramentas de Execução e Cobertura de Testes',
        summary: 'Automação de testes de regressão e medição de cobertura.',
        text: 'Ferramentas de automação de testes (Selenium, Cypress, Playwright) executam scripts e medem a porcentagem de código exercitada pelos testes.',
      },
      {
        title: 'Ferramentas para Testes Não-Funcionais',
        summary: 'Medição de desempenho, estresse, segurança e usabilidade.',
        text: 'Simulam milhares de usuários virtuais para medir tempo de resposta e vazão (JMx/JMeter, k6, ZAP para segurança).',
      },
      {
        title: 'Ferramentas de DevOps e Integração Contínua',
        summary: 'Integração no pipeline de CI/CD.',
        text: 'Ferramentas como Jenkins, GitHub Actions e GitLab CI orquestram a execução automática de testes a cada commit de código.',
      },
      {
        title: 'Benefícios Potenciais da Automação de Testes',
        summary: 'Economia de tempo, consistência e rápida detecção de regressões.',
        text: 'Reduz o trabalho manual repetitivo, previne erros humanos simples e fornece avaliação objetiva e veloz sobre a qualidade do build.',
      },
      {
        title: 'Economia de Tempo e Testes de Regressão',
        summary: 'Executando centenas de testes em poucos minutos.',
        text: 'O maior retorno sobre investimento (ROI) da automação é obtido nos testes de regressão executados frequentemente no pipeline.',
      },
      {
        title: 'Maior Consistência e Repetibilidade',
        summary: 'Eliminando variações causadas por cansaço humano.',
        text: 'Testes automatizados executam exatamente os mesmos passos com os mesmos dados em todas as execuções sem falhas operacionais.',
      },
      {
        title: 'Acesso Facilitado a Métricas de Qualidade',
        summary: 'Relatórios automáticos e dashboards integrados.',
        text: 'Fornecem estatísticas em tempo real sobre taxa de aprovação, cobertura de código e tempos de resposta do sistema.',
      },
      {
        title: 'Riscos Potenciais da Automação de Testes',
        summary: 'Expectativas irrealistas e alto custo de manutenção.',
        text: 'Achar que a automação substitui o pensamento crítico humano ou subestimar o esforço contínuo de manutenção dos scripts são os maiores riscos.',
      },
      {
        title: 'Expectativas Irrealistas sobre Ferramentas',
        summary: 'Ferramentas não pensam nem corrigem processos ruins.',
        text: 'Uma ferramenta de teste automatizado aplicada a um processo de teste desorganizado apenas automatizará a desorganização.',
      },
      {
        title: 'Subestimativa de Tempo e Custos de Manutenção',
        summary: 'O custo do script não é apenas a sua criação.',
        text: 'Sempre que a interface da aplicação muda, os testes automatizados precisam ser atualizados. A manutenção exige tempo significativo.',
      },
      {
        title: 'Dependência do Fornecedor e Ferramentas Open Source',
        summary: 'Riscos de descontinuação e suporte limitado.',
        text: 'Ferramentas proprietárias podem ser descontinuadas ou encarecer. Ferramentas código aberto exigem conhecimento da comunidade para resolver falhas.',
      },
      {
        title: 'Incompatibilidade com a Plataforma de Desenvolvimento',
        summary: 'Garantindo que a ferramenta funcione na pilha tecnológica do projeto.',
        text: 'É crucial verificar a compatibilidade técnica da ferramenta com a linguagem, frameworks e ambientes utilizados pela equipe.',
      },
      {
        title: 'Fatores de Sucesso na Introdução de Ferramentas',
        summary: 'Projetos piloto e treinamento da equipe.',
        text: 'Para introduzir uma nova ferramenta com sucesso: realize um projeto piloto, avalie a cultura do time, ofereça treinamento e defina padrões de uso.',
      }
    ]),
    quizQuestions: [
      {
        id: 'q6_1',
        chapterId: 6,
        chapterTitle: 'Ferramentas de Teste',
        taxonomy: 'K1',
        stem: 'Qual dos seguintes é um benefício primário da automação de testes?',
        options: [
          'Eliminar 100% dos testes manuais e a necessidade de testadores no projeto.',
          'Economizar tempo na execução frequente de testes de regressão repetitivos.',
          'Garantir que não haja nenhum erro de lógica na especificação de requisitos.',
          'Garantir que o software nunca mais apresente falhas em produção.'
        ],
        correctIndex: 1,
        explanation: 'O maior valor da automação é reduzir o esforço manual na execução de testes de regressão repetitivos.'
      }
    ]
  }
];

export const OFFICIAL_MOCK_EXAM_QUESTIONS: Question[] = [
  // Ch1
  {
    id: 'mock_1',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K1',
    stem: 'Qual dos seguintes é o objetivo principal da atividade de teste de software?',
    options: [
      'Provar que o software está 100% livre de defeitos antes do lançamento.',
      'Avaliar produtos de trabalho, encontrar defeitos e fornecer informações sobre a qualidade aos stakeholders.',
      'Substituir a necessidade de desenvolvedores realizarem depuração (debugging).',
      'Garantir que o projeto termine antes do prazo previsto.'
    ],
    correctIndex: 1,
    explanation: 'Testes avaliam a qualidade, encontram defeitos e auxiliam os stakeholders na tomada de decisão.'
  },
  {
    id: 'mock_2',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K2',
    stem: 'Qual das opções melhor exemplifica a diferença entre erro e falha no ISTQB?',
    options: [
      'Um erro é uma ação humana incorreta; uma falha é o comportamento visível e incorreto do sistema durante a execução.',
      'Um erro é o bug no código; uma falha é a distração do programador.',
      'Erro e falha são termos idênticos e intercambiáveis.',
      'Uma falha é o defeito nos requisitos; um erro é a falha em produção.'
    ],
    correctIndex: 0,
    explanation: 'Erro = engano humano; Defeito = bug no artefato; Falha = comportamento incorreto durante execução.'
  },
  {
    id: 'mock_3',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K2',
    stem: 'Qual princípio de teste afirma que a maioria dos defeitos descobertos costuma se concentrar em um pequeno número de módulos?',
    options: [
      'Agrupamento de Defeitos (Princípio de Pareto)',
      'O Paradoxo do Pesticida',
      'Ilusão da Ausência de Erros',
      'Testes Exaustivos são Impossíveis'
    ],
    correctIndex: 0,
    explanation: 'A regra 80/20 indica que um pequeno número de módulos geralmente contém a maior parte dos defeitos.'
  },
  {
    id: 'mock_4',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K2',
    stem: 'A atividade de teste que envolve analisar os requisitos e arquitetura para definir O QUE testar é chamada de:',
    options: [
      'Análise de Teste',
      'Execução de Teste',
      'Depuração',
      'Encerramento de Teste'
    ],
    correctIndex: 0,
    explanation: 'Análise de Teste identifica os itens e condições de teste (O QUE testar).'
  },
  {
    id: 'mock_5',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K1',
    stem: 'O que significa o conceito Shift-Left no processo de teste?',
    options: [
      'Iniciar as atividades de teste o mais cedo possível no ciclo de vida do software.',
      'Mover a equipe de testes para a extrema esquerda do escritório.',
      'Transferir a responsabilidade dos testes inteiramente para o cliente.',
      'Executar testes apenas no ambiente de homologação.'
    ],
    correctIndex: 0,
    explanation: 'Shift-Left preconiza iniciar testes precocemente nas fases iniciais do SDLC.'
  },
  {
    id: 'mock_6',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K2',
    stem: 'Qual das seguintes afirmações sobre o Princípio "O teste depende do contexto" está correta?',
    options: [
      'Um aplicativo bancário de missão crítica requer a mesma abordagem de teste que um jogo de celular.',
      'Diferentes tipos de sistemas e metodologias exigem diferentes estratégias e níveis de rigor de teste.',
      'Testar em contexto ágil elimina a necessidade de qualquer documentação de teste.',
      'Todos os projetos devem seguir rigorosamente o modelo Cascata.'
    ],
    correctIndex: 1,
    explanation: 'O contexto (domínio, riscos, metodologia) determina a estratégia de teste apropriada.'
  },
  {
    id: 'mock_7',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K2',
    stem: 'A Rastreabilidade entre a Base de Teste e os Casos de Teste é importante porque:',
    options: [
      'Permite verificar se todos os requisitos foram cobertos por testes e medir o impacto de mudanças.',
      'Garante que os testes sejam executados sem falhas.',
      'Substitui a necessidade de relatórios de bugs.',
      'Aumenta o tempo necessário para executar os testes manuais.'
    ],
    correctIndex: 0,
    explanation: 'Rastreabilidade assegura a medição de cobertura de requisitos e análise de impacto de alterações.'
  },

  // Ch2
  {
    id: 'mock_8',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'Qual a principal característica do nível de Teste de Componente (Unidade)?',
    options: [
      'Foca em testar módulos ou classes individuais em isolamento, geralmente conduzido por desenvolvedores.',
      'Foca na integração de sistemas externos com bancos de dados.',
      'É realizado exclusivamente pelos usuários finais no ambiente de produção.',
      'Testa o sistema completo de ponta a ponta.'
    ],
    correctIndex: 0,
    explanation: 'Teste de componente isola unidades de código com o uso de stubs/mocks.'
  },
  {
    id: 'mock_9',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'Qual é o objetivo principal do Teste de Aceitação do Usuário (UAT)?',
    options: [
      'Garantir que a arquitetura do banco de dados seja escalável.',
      'Demonstrar que o sistema atende às necessidades de negócio dos usuários e que está pronto para produção.',
      'Encontrar estouros de memória no código-fonte C++.',
      'Garantir que 100% das linhas de código foram executadas.'
    ],
    correctIndex: 1,
    explanation: 'UAT valida a adequação às necessidades de negócio e prontidão para implantação.'
  },
  {
    id: 'mock_10',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'O Teste de Regressão deve ser realizado:',
    options: [
      'Apenas uma vez ao ano antes da auditoria ISO.',
      'Sempre que o software sofrer alterações para garantir que partes inalteradas não foram afetadas.',
      'Somente quando o cliente exigir formalmente em contrato.',
      'Apenas durante o teste de unidade.'
    ],
    correctIndex: 1,
    explanation: 'Testes de regressão previnem efeitos colaterais resultantes de mudanças no código.'
  },
  {
    id: 'mock_11',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'Sobre os tipos de teste Funcionais e Não-Funcionais (ISO 25010), assinale a opção correta:',
    options: [
      'Testes funcionais avaliam "O QUE" o sistema faz; testes não-funcionais avaliam "COMO BEM" ele se comporta (ex: desempenho, segurança).',
      'Testes não-funcionais só se aplicam a código C#.',
      'Testes funcionais não exigem requisitos.',
      'Ambos são testados apenas após a implantação em produção.'
    ],
    correctIndex: 0,
    explanation: 'Funcional = O QUE o sistema faz. Não-funcional = atributos de qualidade do sistema.'
  },
  {
    id: 'mock_12',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'Qual abordagem de desenvolvimento prevê escrever testes em linguagem natural orientada a comportamento (Dado/Quando/Então) antes do código?',
    options: [
      'BDD (Behavior-Driven Development)',
      'Modelo Cascata Tradicional',
      'Programação Extrema sem Teste',
      'Análise Estática de Código'
    ],
    correctIndex: 0,
    explanation: 'BDD utiliza especificações executáveis em formato Dado/Quando/Então.'
  },
  {
    id: 'mock_13',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'Em relação ao Teste de Manutenção, qual dos seguintes é um gatilho típico para sua realização?',
    options: [
      'Uma modificação como hotfix de emergência ou atualização de versão de banco de dados.',
      'A criação do primeiro protótipo no Figma.',
      'A contratação de um novo desenvolvedor estagiário.',
      'A definição da identidade visual da empresa.'
    ],
    correctIndex: 0,
    explanation: 'Gatilhos de manutenção incluem modificações, migrações de plataforma ou descontinuação de sistemas.'
  },

  // Ch3
  {
    id: 'mock_14',
    chapterId: 3,
    chapterTitle: 'Testes Estáticos',
    taxonomy: 'K2',
    stem: 'Qual das opções abaixo representa uma vantagem marcante do teste estático sobre o teste dinâmico?',
    options: [
      'Detecta defeitos diretamente nos documentos antes mesmo que o código seja escrito ou executado, reduzindo o custo de correção.',
      'Elimina a necessidade de realizar testes de sistema.',
      'Garante que o tempo de resposta em milissegundos seja ótimo.',
      'Executa o código em múltiplos servidores concorrentemente.'
    ],
    correctIndex: 0,
    explanation: 'Teste estático encontra defeitos em requisitos/design antecipadamente a um custo muito menor.'
  },
  {
    id: 'mock_15',
    chapterId: 3,
    chapterTitle: 'Testes Estáticos',
    taxonomy: 'K1',
    stem: 'Qual tipo de revisão é o mais formal, possui papeis definidos como Moderador e Escrevente e utiliza métricas de progresso?',
    options: [
      'Inspeção',
      'Revisão Informal',
      'Walkthrough',
      'Análise em Par'
    ],
    correctIndex: 0,
    explanation: 'Inspeção é o formato de revisão mais formal no padrão ISTQB.'
  },
  {
    id: 'mock_16',
    chapterId: 3,
    chapterTitle: 'Testes Estáticos',
    taxonomy: 'K2',
    stem: 'Em uma revisão formal, qual é a responsabilidade primária do Escrevente (Scribe)?',
    options: [
      'Registrar todas as anomalias, opiniões e decisões tomadas durante a reunião de revisão.',
      'Decidir o orçamento financeiro da equipe de testes.',
      'Aprovar ou reprovar o código do autor sozinho.',
      'Escrever o código-fonte em linguagem Java.'
    ],
    correctIndex: 0,
    explanation: 'O Escrevente documenta os achados, defeitos e itens de ação da reunião.'
  },
  {
    id: 'mock_17',
    chapterId: 3,
    chapterTitle: 'Testes Estáticos',
    taxonomy: 'K2',
    stem: 'Qual das alternativas descreve corretamente um Walkthrough?',
    options: [
      'Uma revisão conduzida pelo autor do artefato para explicar o documento aos participantes e obter feedback.',
      'Uma auditoria fiscal externa sem a presença do desenvolvedor.',
      'Um teste de carga executado com ferramentas automatizadas.',
      'Uma inspeção estrita com checklists de conformidade ISO.'
    ],
    correctIndex: 0,
    explanation: 'No Walkthrough, o autor lidera a apresentação e discussão do seu produto de trabalho.'
  },

  // Ch4
  {
    id: 'mock_18',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K3',
    stem: 'Um sistema aceita valores de salário de R$ 1.500,00 a R$ 10.000,00. Utilizando Particionamento de Equivalência (EP), quais seriam as 3 partições de entrada?',
    options: [
      'Salário < 1.500 (Inválida); 1.500 a 10.000 (Válida); Salário > 10.000 (Inválida)',
      'Apenas valores exatos 1.500 e 10.000',
      'Qualquer valor inteiro positivo',
      '0, 1.500 e 10.000'
    ],
    correctIndex: 0,
    explanation: 'EP divide o domínio em 1 partição válida e 2 partições inválidas (abaixo do mínimo e acima do máximo).'
  },
  {
    id: 'mock_19',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K3',
    stem: 'No mesmo caso de salário de R$ 1.500 a R$ 10.000, aplicando a Análise do Valor Limite de 2 Valores (2-value BVA), quais valores cobrem o limite inferior?',
    options: [
      'R$ 1.499,99 e R$ 1.500,00',
      'R$ 0,00 e R$ 1.500,00',
      'R$ 1.500,00 e R$ 10.000,00',
      'R$ 1.501,00 e R$ 2.000,00'
    ],
    correctIndex: 0,
    explanation: 'O limite inferior 1.500 é testado no limite exato e no valor vizinho imediatamente fora (1.499,99).'
  },
  {
    id: 'mock_20',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K2',
    stem: 'Qual técnica de teste caixa-preta é mais adequada para modelar regras de negócio complexas com várias combinações de condições lógicas?',
    options: [
      'Tabela de Decisão',
      'Teste de Ramo',
      'Error Guessing',
      'Particionamento de Equivalência de 1 Valor'
    ],
    correctIndex: 0,
    explanation: 'Tabelas de decisão estruturam combinações de condições lógicas e suas ações associadas.'
  },
  {
    id: 'mock_21',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K2',
    stem: 'Em um modelo de Transição de Estados, o que o critério de cobertura "0-switch" (transições válidas) garante?',
    options: [
      'Que todas as transições válidas de um estado para outro sejam executadas ao menos uma vez.',
      'Que todas as transições inválidas sejam executadas duas vezes.',
      'Que apenas o estado inicial seja visitado.',
      'Que 100% das linhas do código-fonte C# sejam cobertas.'
    ],
    correctIndex: 0,
    explanation: '0-switch (Single State Transition) garante a execução de cada transição direta válida.'
  },
  {
    id: 'mock_22',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K2',
    stem: 'Em testes caixa-branca, se um conjunto de testes atinge 100% de Cobertura de Ramo (Branch Coverage), qual será a Cobertura de Instrução (Statement Coverage)?',
    options: [
      '100% de Cobertura de Instrução.',
      '50% de Cobertura de Instrução.',
      '0% de Cobertura de Instrução.',
      'Não é possível determinar sem ler o código.'
    ],
    correctIndex: 0,
    explanation: 'Cobertura de Ramo engloba (subsume) a Cobertura de Instrução: 100% ramos garante 100% instruções.'
  },
  {
    id: 'mock_23',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K2',
    stem: 'O Teste Exploratório é caracterizado por:',
    options: [
      'Design, execução e aprendizado simultâneos durante a sessão de teste.',
      'Seguir rigorosamente um script de teste congelado 6 meses atrás.',
      'Ser executado apenas por robôs em Python.',
      'Não permitir a anotação de relatórios de anomalias.'
    ],
    correctIndex: 0,
    explanation: 'Teste exploratório combina design e execução dinâmica com aprendizado do testador.'
  },
  {
    id: 'mock_24',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K2',
    stem: 'A técnica de Suposição de Erros (Error Guessing) fundamenta-se principalmente em:',
    options: [
      'Experiência do testador, conhecimento do histórico de bugs e intuição sobre falhas comuns.',
      'Fórmulas matemáticas de permutação randômica.',
      'Ferramentas de análise de fluxo de controle estático.',
      'Consultar a documentação de patentes do software.'
    ],
    correctIndex: 0,
    explanation: 'Error guessing utiliza a experiência do profissional em antecipar enganos comuns.'
  },

  // Ch5
  {
    id: 'mock_25',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'O que são Critérios de Entrada (Definition of Ready - DoR) em um Plano de Teste?',
    options: [
      'Conjunto de pré-condições necessárias para iniciar formalmente uma atividade de teste.',
      'Os critérios para declarar o projeto encerrado e demitir a equipe.',
      'A lista de falhas que foram enviadas para produção.',
      'A taxa de desconto cobrada pelo fornecedor.'
    ],
    correctIndex: 0,
    explanation: 'Critérios de Entrada definem os pré-requisitos para começar as atividades de teste.'
  },
  {
    id: 'mock_26',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'Na técnica de estimativa baseada em consenso "Planning Poker" (Wideband Delphi):',
    options: [
      'A equipe discute os requisitos e estimam individualmente o esforço através de cartas antes de buscarem o consenso.',
      'O gerente de projetos decide o prazo sozinho sem consultar o time.',
      'Calcula-se a média aritmética simples entre o menor e maior valor de mercado.',
      'Sorteia-se o prazo em um dado de 6 lados.'
    ],
    correctIndex: 0,
    explanation: 'Planning Poker é uma variante do Wideband Delphi focada em estimativas colaborativas.'
  },
  {
    id: 'mock_27',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'Qual a recomendação principal do modelo da Pirâmide de Testes?',
    options: [
      'Possuir uma base sólida de muitos testes unitários automatizados e rápidos, e uma quantidade menor de testes de UI/E2E no topo.',
      'Fazer 90% dos testes manualmente através da interface gráfica.',
      'Eliminar os testes de integração e focar apenas na aceitação.',
      'Construir testes lentos e caros na base da pirâmide.'
    ],
    correctIndex: 0,
    explanation: 'Pirâmide de testes: base ampla de testes unitários rápidos, topo reduzido de UI.'
  },
  {
    id: 'mock_28',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'Qual a diferença entre Risco de Produto e Risco de Projeto?',
    options: [
      'Risco de produto refere-se a falhas de qualidade no software; risco de projeto refere-se a problemas de gestão (atrasos, orçamento).',
      'Risco de projeto é testado pelo usuário; risco de produto é testado pelo desenvolvedor.',
      'Não há diferença entre eles no ISTQB CTFL v4.0.1.',
      'Risco de produto é sempre financeiro; risco de projeto é sempre de hardware.'
    ],
    correctIndex: 0,
    explanation: 'Produto = qualidade do artefato/funcionalidade. Projeto = gestão, prazos e recursos.'
  },
  {
    id: 'mock_29',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'Como o Nível de Risco de um item é calculado na Análise de Risco?',
    options: [
      'Multiplicando a Probabilidade de ocorrência do evento pelo Impacto/Dano causado.',
      'Somando a quantidade de linhas de código pelo número de desenvolvedores.',
      'Dividindo o salário do tester pelas horas trabalhadas.',
      'Subtraindo os testes falhos dos testes executados.'
    ],
    correctIndex: 0,
    explanation: 'Nível de Risco = Probabilidade x Impacto.'
  },
  {
    id: 'mock_30',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'Qual informação é CRUCIAL constar em um relatório de defeitos bem elaborado?',
    options: [
      'Passos detalhados para reproduzir a falha, resultado esperado e resultado observado.',
      'O nome do desenvolvedor que cometeu o erro acompanhado de advertência.',
      'O preço de compra do computador do cliente.',
      'O código de licença do sistema operacional.'
    ],
    correctIndex: 0,
    explanation: 'Um bom bug report exige passos reprodutíveis, resultado esperado e real.'
  },

  // Ch6
  {
    id: 'mock_31',
    chapterId: 6,
    chapterTitle: 'Ferramentas de Teste',
    taxonomy: 'K1',
    stem: 'Qual das alternativas indica um grande benefício trazido pela automação de testes?',
    options: [
      'Execução rápida, repetível e consistente de suítes de regressão em pipelines de CI/CD.',
      'Substituir a necessidade de planejar e conceber casos de teste.',
      'Garantir que o software não possua erros de requisitos.',
      'Eliminar completamente a equipe de QA.'
    ],
    correctIndex: 0,
    explanation: 'Automação sobressai-se na repetibilidade e velocidade nos testes de regressão.'
  },
  {
    id: 'mock_32',
    chapterId: 6,
    chapterTitle: 'Ferramentas de Teste',
    taxonomy: 'K2',
    stem: 'Um dos maiores RISCOS ao introduzir automação de testes em uma organização é:',
    options: [
      'Subestimar o tempo e esforço contínuos necessários para manter os scripts quando o sistema muda.',
      'Executar os testes de forma muito rápida.',
      'Ter relatórios de execução muito claros.',
      'Aumentar a cobertura de código.'
    ],
    correctIndex: 0,
    explanation: 'Manutenção de scripts automatizados é frequentemente subestimada e gera alto custo.'
  },
  {
    id: 'mock_33',
    chapterId: 6,
    chapterTitle: 'Ferramentas de Teste',
    taxonomy: 'K2',
    stem: 'O que se entende por "Ferramentas de Análise Estática"?',
    options: [
      'Ferramentas que analisam o código-fonte ou documentos sem executá-los para encontrar violações de padrões e bugs.',
      'Ferramentas que estressam o servidor com chamadas HTTP simultâneas.',
      'Monitores de temperatura da CPU.',
      'Geradores manuais de planilhas Excel.'
    ],
    correctIndex: 0,
    explanation: 'Análise estática inspeciona artefatos sem execução de código.'
  },
  {
    id: 'mock_34',
    chapterId: 6,
    chapterTitle: 'Ferramentas de Teste',
    taxonomy: 'K2',
    stem: 'Em um projeto de introdução de uma nova ferramenta de teste, qual é uma boa prática recomendada pelo ISTQB?',
    options: [
      'Realizar um projeto piloto para avaliar a ferramenta, definir padrões de uso e treinar a equipe.',
      'Comprar a ferramenta mais cara do mercado e impô-la imediatamente a todos os times sem treinamento.',
      'Substituir todos os processos de teste existentes pela configuração padrão do software.',
      'Demitir a equipe de teste antes de instalar o software.'
    ],
    correctIndex: 0,
    explanation: 'Projetos piloto testam a viabilidade e preparam o time para adoção de ferramentas.'
  },
  {
    id: 'mock_35',
    chapterId: 1,
    chapterTitle: 'Fundamentos da Testagem',
    taxonomy: 'K2',
    stem: 'Quando se diz que "O teste é um processo contínuo", significa que:',
    options: [
      'Atividades de teste ocorrem paralelamente a todas as fases do SDLC, desde o planejamento até o descarte.',
      'Os testes devem ser executados 24 horas por dia sem pausa para almoço.',
      'Não há necessidade de parar para corrigir os defeitos encontrados.',
      'Os testes nunca chegam ao fim, mesmo após o encerramento do projeto.'
    ],
    correctIndex: 0,
    explanation: 'O processo de teste acompanha todas as fases do ciclo de vida do software.'
  },
  {
    id: 'mock_36',
    chapterId: 2,
    chapterTitle: 'Teste ao Longo do SDLC',
    taxonomy: 'K2',
    stem: 'Qual nível de teste é responsável por verificar a integração do sistema sob teste com sistemas externos e serviços de terceiros?',
    options: [
      'Teste de Integração de Sistemas',
      'Teste de Componente',
      'Teste de Aceitação Operacional',
      'Análise Estática'
    ],
    correctIndex: 0,
    explanation: 'System Integration Testing (SIT) valida a comunicação com sistemas externos.'
  },
  {
    id: 'mock_37',
    chapterId: 3,
    chapterTitle: 'Testes Estáticos',
    taxonomy: 'K2',
    stem: 'Em uma revisão formal, o papel responsável por decidir se os critérios de saída foram alcançados e verificar as correções efetuadas é:',
    options: [
      'Líder de Revisão',
      'Estagiário de TI',
      'Escrevente',
      'Usuário Final'
    ],
    correctIndex: 0,
    explanation: 'O Líder de Revisão gerencia o fechamento e critérios de saída do processo.'
  },
  {
    id: 'mock_38',
    chapterId: 4,
    chapterTitle: 'Análise e Design de Testes',
    taxonomy: 'K3',
    stem: 'Em uma Tabela de Decisão com 4 condições booleanas independentes (Verdadeiro/Falso), quantas regras (colunas) seriam geradas antes de qualquer simplificação?',
    options: [
      '16 regras (2^4)',
      '8 regras',
      '4 regras',
      '32 regras'
    ],
    correctIndex: 0,
    explanation: 'Com 4 condições binárias, a tabela completa possui 2^4 = 16 combinações possíveis.'
  },
  {
    id: 'mock_39',
    chapterId: 5,
    chapterTitle: 'Gestão de Testes',
    taxonomy: 'K2',
    stem: 'Os Quadrantes de Teste (Brian Marick) ajudam as equipes a:',
    options: [
      'Garantir que todos os tipos de teste (técnicos, de negócio, de suporte ao time e de crítica ao produto) sejam considerados.',
      'Dividir a equipe de testes em 4 turnos de trabalho.',
      'Calcular o salário mensal dos analistas de teste.',
      'Organizar os arquivos na pasta Meus Documentos.'
    ],
    correctIndex: 0,
    explanation: 'Os 4 quadrantes cobrem o espectro completo de testes técnicos e de negócio.'
  },
  {
    id: 'mock_40',
    chapterId: 6,
    chapterTitle: 'Ferramentas de Teste',
    taxonomy: 'K1',
    stem: 'Qual a função de uma ferramenta de Gerenciamento de Testes (Test Management Tool)?',
    options: [
      'Oferecer suporte ao rastreamento de requisitos, gestão de casos de teste, agendamento de execução e relatórios.',
      'Compilar o código C++ e gerar binários executáveis.',
      'Substituir o banco de dados de produção.',
      'Realizar chamadas telefônicas para os clientes.'
    ],
    correctIndex: 0,
    explanation: 'Ferramentas de test management organizam artefatos, rastreabilidade e relatórios.'
  }
];

export function getIstqbChapters(lang: 'pt' | 'en' = 'pt'): Chapter[] {
  if (lang === 'pt') return ISTQB_CHAPTERS;

  return ISTQB_CHAPTERS.map(ch => {
    const overlay = EN_CHAPTER_OVERLAY[ch.id];
    return {
      ...ch,
      title: overlay?.title || ch.title,
      subtitle: overlay?.subtitle || ch.subtitle,
      description: overlay?.description || ch.description,
      syllabusReference: overlay?.syllabusReference || ch.syllabusReference,
      badge: {
        ...ch.badge,
        name: overlay?.badgeName || ch.badge.name,
        description: overlay?.badgeDesc || ch.badge.description,
      },
      lessons: ch.lessons.map(lesson => {
        const qOverlay = EN_QUESTIONS_MAP[lesson.id];
        return {
          ...lesson,
          title: qOverlay?.stem ? lesson.title : lesson.title.replace('Capítulo', 'Chapter'),
          summary: qOverlay?.explanation || lesson.summary,
        };
      }),
      quizQuestions: ch.quizQuestions.map(q => {
        const qOverlay = EN_QUESTIONS_MAP[q.id];
        if (!qOverlay) return q;
        return {
          ...q,
          chapterTitle: qOverlay.chapterTitle || q.chapterTitle,
          stem: qOverlay.stem,
          options: qOverlay.options,
          explanation: qOverlay.explanation,
        };
      }),
    };
  });
}

export function getOfficialMockExamQuestions(lang: 'pt' | 'en' = 'pt'): Question[] {
  if (lang === 'pt') return OFFICIAL_MOCK_EXAM_QUESTIONS;

  return OFFICIAL_MOCK_EXAM_QUESTIONS.map(q => {
    const qOverlay = EN_QUESTIONS_MAP[q.id];
    if (!qOverlay) return q;
    return {
      ...q,
      chapterTitle: qOverlay.chapterTitle || q.chapterTitle,
      stem: qOverlay.stem,
      options: qOverlay.options,
      explanation: qOverlay.explanation,
    };
  });
}

