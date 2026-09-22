ALTER TABLE instituicoes
ADD COLUMN IF NOT EXISTS tipo VARCHAR(30);

DELETE FROM ofertas;
DELETE FROM instituicoes;

INSERT INTO instituicoes (
    id,
    nome,
    rede,
    cidade,
    estado,
    nota_mec,
    mensalidade_media,
    possui_bolsas,
    avaliacao_media,
    total_avaliacoes,
    foto_capa,
    status_vaga,
    tipo
) VALUES
('ac-01','Instituto Federal do Acre (IFAC)','publica','Rio Branco','AC',4,0.00,true,4.2,45,'https://s2.static.brasilescola.uol.com.br/vestibular/2021/09/ifac-rio-branco.jpg','verde','tecnico'),

('al-01','Universidade Federal de Alagoas (UFAL)','publica','Maceió','AL',4,0.00,true,4.3,65,'https://mapas.ufal.br/assets/imgs/sertao.jpg','verde','universidade'),

('ap-01','Instituto Federal do Amapá (IFAP)','publica','Macapá','AP',4,0.00,true,4.1,38,'https://portal.redefederal.org.br/images/galeria/ifap/15.jpg','amarelo','tecnico'),

('am-01','Universidade Federal do Amazonas (UFAM)','publica','Manaus','AM',4,0.00,true,4.4,72,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXupYgb9F2HGYpcTNtUqUPvwXNShBJPZRz1QPGiuJn4nrRzlWrGnMHPtA&s=10','verde','universidade'),

('ba-01','Universidade Federal da Bahia (UFBA)','publica','Salvador','BA',5,0.00,true,4.6,128,'https://ufba.br/sites/portal.ufba.br/files/noticias/reitoria_ufba.png','verde','universidade'),

('ba-02','Universidade Salvador (UNIFACS)','privada','Salvador','BA',4,1468.00,true,4.4,96,'https://bahiaeconomica.com.br/wp/wp-content/uploads/2023/09/141429em-nova-decisao-justica-manda-unifacs-autorizar-colacao-de-grau-de-estudantes-de-medicina-3.jpg','verde','faculdade'),

('ba-03','SENAI CIMATEC','privada','Salvador','BA',5,850.00,true,4.6,112,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaQYB3b1iVeZl0G8EYsOcTrMsD73jnRTgjXJs09-VM_aD8Unmwz5AL-NTF&s=10','verde','tecnico'),

('ba-04','Colégio Antônio Vieira','privada','Salvador','BA',4,1800.00,false,4.7,85,'https://www.colegioantoniovieira.com.br/wp-content/uploads/2020/02/internal-featured-image.jpg','verde','escola'),

('ba-05','Colégio Salesiano do Salvador','privada','Salvador','BA',4,1650.00,true,4.5,74,'https://salesiano-ba.com.br/wp-content/uploads/2025/10/foto_liceu.jpg','verde','escola'),

('ce-01','Universidade Federal do Ceará (UFC)','publica','Fortaleza','CE',5,0.00,true,4.5,115,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjDrJqF8aIuS5rt4vVBuHgeM2Y44JW-cis39eK64IyARvdjesQCjXU14f6&s=10','verde','universidade'),

('df-01','Universidade de Brasília (UnB)','publica','Brasília','DF',5,0.00,true,4.7,156,'https://upload.wikimedia.org/wikipedia/commons/f/f9/Campus_Darcy_Ribeiro_%2831398447555%29.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original','verde','universidade'),

('es-01','Universidade Federal do Espírito Santo (UFES)','publica','Vitória','ES',4,0.00,true,4.3,68,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1MtLbxOy-yRdLNxt6s7HuqmvpH53jkz23Q1U4MQpGnyZw91tqXX9icu9a&s=10','verde','universidade'),

('go-01','Universidade Federal de Goiás (UFG)','publica','Goiânia','GO',4,0.00,true,4.2,71,'https://opopular.com.br/image/policy:1.3092303:1702515514/image.jpg','verde','universidade'),

('ma-01','Universidade Federal do Maranhão (UFMA)','publica','São Luís','MA',4,0.00,true,4.1,55,'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/CUniversitaria.jpg/250px-CUniversitaria.jpg?utm_source=pt.wikipedia.org&utm_campaign=parser&utm_content=thumbnail','verde','universidade'),

('mt-01','Universidade Federal de Mato Grosso (UFMT)','publica','Cuiabá','MT',4,0.00,true,4.1,54,'https://www.ufmt.br/assets/images/reitoria.jpg','verde','universidade'),

('ms-01','Universidade Federal de Mato Grosso do Sul (UFMS)','publica','Campo Grande','MS',4,0.00,true,4.0,48,'https://cfbio.gov.br/wp-content/uploads/2022/05/UFMS.jpg','amarelo','universidade'),

('mg-01','Universidade Federal de Minas Gerais (UFMG)','publica','Belo Horizonte','MG',5,0.00,true,4.8,189,'https://s3.static.brasilescola.uol.com.br/vestibular/2025/05/ufmg.png','verde','universidade'),

('mg-02','Pontifícia Universidade Católica de Minas Gerais (PUC Minas)','privada','Belo Horizonte','MG',5,741.00,true,4.6,174,'https://www.brasildefato.com.br/wp-content/uploads/2024/09/image_processing20211104-13537-3astno.jpeg','verde','faculdade'),

('mg-03','Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)','publica','Belo Horizonte','MG',5,0.00,true,4.7,132,'https://s2-g1.glbimg.com/YXs5Jdwm-TBK6yDbrOEt_ZZVAlE=/0x0:1280x622/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/I/d/dA3OHcSGahT32AAuM7dg/cefet.jpeg','verde','tecnico'),

('mg-04','Colégio Santo Antônio','privada','Belo Horizonte','MG',4,2100.00,false,4.7,94,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpKaNdmrtkku3ZKBh8wN_vmY9U5oSXlW70TizU4FVZvBRyvMHXTgaY-YSI&s=10','verde','escola'),

('mg-05','Colégio Bernoulli','privada','Belo Horizonte','MG',5,2300.00,true,4.8,121,'https://www.bernoulli.com.br/app/uploads/2023/06/foto-fachada-colegio-bernoulli-pituba.webp','verde','escola'),

('pa-01','Universidade Federal do Pará (UFPA)','publica','Belém','PA',4,0.00,true,4.1,59,'https://s1.static.brasilescola.uol.com.br/vestibular/2020/12/ufpa.jpg','verde','universidade'),

('pb-01','Universidade Federal da Paraíba (UFPB)','publica','João Pessoa','PB',4,0.00,true,4.0,44,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJu0BR6KF8QC8VtDUnglgwZhI8v-cBJIFQXGN23Uad6HCKp4FAPgEhQyk&s=10','amarelo','universidade'),

('pr-01','Universidade Federal do Paraná (UFPR)','publica','Curitiba','PR',5,0.00,true,4.7,167,'https://upload.wikimedia.org/wikipedia/commons/7/7d/UFPR_vista_frontal.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original','verde','universidade'),

('pr-02','Pontifícia Universidade Católica do Paraná (PUCPR)','privada','Curitiba','PR',5,2955.85,true,4.6,145,'https://midia-wp-kinsta-grupomarista.s3.sa-east-1.amazonaws.com/grupo-marista-2022/wp-content/uploads/2024/11/13122634/imagens-para-o-blog.png','verde','faculdade'),

('pr-03','Universidade Positivo','privada','Curitiba','PR',4,1290.00,true,4.4,118,'https://www.up.edu.br/wp-content/uploads/2019/10/CSE-UP-ImagemExternaReitoria-Grande.webp','verde','faculdade'),

('pr-04','Colégio Positivo','privada','Curitiba','PR',4,2200.00,true,4.7,102,'https://folhadolitoral.com.br/wp-content/uploads/2023/05/p4239pee.jpg','verde','escola'),

('pr-05','SENAI Paraná','privada','Curitiba','PR',5,650.00,true,4.6,97,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbCK8FTTwRFrkmWcof2nIUzo0dzw1S7_tNIvjAJVynxREEdOnqaXd3vZKz&s=10','verde','tecnico'),

('pe-01','Universidade Federal de Pernambuco (UFPE)','publica','Recife','PE',5,0.00,true,4.6,134,'https://www.tribunapiaui.com.br/images/noticias/87429/763900bb206b3a100ec31b3f5e4316c1.webp','verde','universidade'),

('pi-01','Universidade Federal do Piauí (UFPI)','publica','Teresina','PI',4,0.00,true,4.0,42,'https://s5.static.brasilescola.uol.com.br/vestibular/2025/03/ufrj.jpg','amarelo','universidade'),

('rj-01','Universidade Federal do Rio de Janeiro (UFRJ)','publica','Rio de Janeiro','RJ',5,0.00,true,4.9,201,'https://s5.static.brasilescola.uol.com.br/vestibular/2025/03/ufrj.jpg','verde','universidade'),

('rj-02','Pontifícia Universidade Católica do Rio de Janeiro (PUC-Rio)','privada','Rio de Janeiro','RJ',5,6561.00,true,4.8,185,'https://www.puc-rio.br/congresso-universidades-iberoamericanas/imagens/img_index_local.jpg','verde','faculdade'),

('rj-03','Universidade Estácio de Sá (UNESA)','privada','Rio de Janeiro','RJ',4,899.00,true,4.2,154,'https://cdn.portal.estacio.br/FACHAD_1_f4ca997018.webp','verde','faculdade'),

('rj-04','Instituto Federal do Rio de Janeiro (IFRJ)','publica','Rio de Janeiro','RJ',5,0.00,true,4.5,98,'https://odia.ig.com.br/_midias/jpg/2022/09/01/foto_ifrj_csg_-26278154.jpg?20220901094427','verde','tecnico'),

('rj-05','Colégio Pedro II','publica','Rio de Janeiro','RJ',5,0.00,true,4.8,156,'https://s3.jvmtecnologia.com.br/98fmnatal/wp-content/uploads/2021/06/concurso-col%C3%A9gio-pedro-II.png','verde','escola'),

('rn-01','Universidade Federal do Rio Grande do Norte (UFRN)','publica','Natal','RN',4,0.00,true,4.2,52,'https://s2-g1.glbimg.com/S3rE64eehDOkc_1YzWsnM8sdjbA=/0x0:1258x773/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/8/t/BA9m4UROqfSKJJWl2DGQ/cicero-oliveira.jpg','amarelo','universidade'),

('rs-01','Universidade Federal do Rio Grande do Sul (UFRGS)','publica','Porto Alegre','RS',5,0.00,true,4.8,178,'https://s3.static.brasilescola.uol.com.br/enem/conteudo/images/reitoria-ufrgs.jpg','verde','universidade'),

('ro-01','Universidade Federal de Rondônia (UNIR)','publica','Porto Velho','RO',4,0.00,true,4.0,43,'https://3.bp.blogspot.com/--30xHwg25co/WYCspt8h6QI/AAAAAAAAG08/PhMrvJuaqrEYDiEUaR4r7EKvIKuz2yBGwCLcBGAs/s1600/unir%2Bcentro.jpg','verde','universidade'),

('rr-01','Universidade Federal de Roraima (UFRR)','publica','Boa Vista','RR',4,0.00,true,3.9,32,'https://vestibulares.estrategia.com/portal/wp-content/uploads/2025/11/prova-ufrr-2026.jpeg','amarelo','universidade'),

('sc-01','Universidade Federal de Santa Catarina (UFSC)','publica','Florianópolis','SC',5,0.00,true,4.7,162,'https://schiefler.adv.br/wp-content/uploads/2025/02/imagem_2025-02-21_122800524.png','verde','universidade'),

('sp-01','Universidade de São Paulo (USP)','publica','São Paulo','SP',5,0.00,true,4.9,245,'https://www.pragmatismopolitico.com.br/wp-content/uploads/2017/10/usp-perde-posto-de-melhor-universidade-america-latina.jpg','verde','universidade'),

('sp-02','Pontifícia Universidade Católica de São Paulo (PUC-SP)','privada','São Paulo','SP',5,3980.00,true,4.7,210,'https://j.pucsp.br/sites/default/files/foto_geral_3.jpg','verde','faculdade'),

('sp-03','Universidade Presbiteriana Mackenzie','privada','São Paulo','SP',5,3200.00,true,4.7,192,'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2021/06/40299_4800A1CEE0055D41.jpeg?w=1024','verde','universidade'),

('sp-04','SENAI São Paulo','privada','São Paulo','SP',5,750.00,true,4.6,198,'https://abflexo.org.br/wp-content/uploads/2021/03/senaibarueri1170.jpg','verde','tecnico'),

('sp-05','SESI São Paulo','privada','São Paulo','SP',4,1600.00,true,4.6,173,'https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?img=img_65_251002_18f6295d-1ca5-46ff-a00b-71b74b22873d_o.jpg&tipo=p','verde','escola'),

('se-01','Universidade Federal de Sergipe (UFS)','publica','Aracaju','SE',4,0.00,true,3.9,35,'https://www.ufs.br/uploads/body_image/gist/158196/_40a7970_29663277107_o.jpg','amarelo','universidade'),

('to-01','Universidade Federal do Tocantins (UFT)','publica','Palmas','TO',4,0.00,true,3.9,35,'https://docs.uft.edu.br/share/proxy/alfresco-noauth/api/internal/shared/node/ThwRyFQkRuy7OIxaQe_Y5g/content/brasao_uft_reitoria_foto_poliana_macedo.jpg','amarelo','universidade')

ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    rede = EXCLUDED.rede,
    cidade = EXCLUDED.cidade,
    estado = EXCLUDED.estado,
    nota_mec = EXCLUDED.nota_mec,
    mensalidade_media = EXCLUDED.mensalidade_media,
    possui_bolsas = EXCLUDED.possui_bolsas,
    avaliacao_media = EXCLUDED.avaliacao_media,
    total_avaliacoes = EXCLUDED.total_avaliacoes,
    foto_capa = EXCLUDED.foto_capa,
    status_vaga = EXCLUDED.status_vaga,
    tipo = EXCLUDED.tipo;

INSERT INTO ofertas (
    id,
    instituicao_id,
    curso_nome,
    nivel,
    modalidade,
    turno,
    periodo
) VALUES
('of-ac-01','ac-01','Técnico em Informática','tecnico','presencial','diurno','2026-2'),
('of-al-01','al-01','Administração','graduacao','presencial','diurno','2026-2'),
('of-ap-01','ap-01','Técnico em Redes de Computadores','tecnico','presencial','diurno','2026-2'),
('of-am-01','am-01','Medicina','graduacao','presencial','integral','2026-2'),

('of-ba-01','ba-01','Direito','graduacao','presencial','diurno','2026-2'),
('of-ba-02','ba-02','Medicina','graduacao','presencial','integral','2026-2'),
('of-ba-03','ba-03','Técnico em Mecatrônica','tecnico','presencial','diurno','2026-2'),
('of-ba-04','ba-04','Ensino Fundamental','fundamental','presencial','diurno','2026-2'),
('of-ba-05','ba-05','Ensino Médio','medio','presencial','diurno','2026-2'),

('of-ce-01','ce-01','Ciência da Computação','graduacao','presencial','diurno','2026-2'),
('of-df-01','df-01','Direito','graduacao','presencial','diurno','2026-2'),
('of-es-01','es-01','Engenharia Civil','graduacao','presencial','integral','2026-2'),
('of-go-01','go-01','Agronomia','graduacao','presencial','integral','2026-2'),
('of-ma-01','ma-01','Enfermagem','graduacao','presencial','integral','2026-2'),
('of-mt-01','mt-01','Medicina Veterinária','graduacao','presencial','integral','2026-2'),
('of-ms-01','ms-01','Medicina','graduacao','presencial','integral','2026-2'),

('of-mg-01','mg-01','Medicina','graduacao','presencial','integral','2026-2'),
('of-mg-02','mg-02','Administração','graduacao','presencial','noturno','2026-2'),
('of-mg-03','mg-03','Técnico em Eletrônica','tecnico','presencial','diurno','2026-2'),
('of-mg-04','mg-04','Ensino Fundamental','fundamental','presencial','diurno','2026-2'),
('of-mg-05','mg-05','Ensino Médio','medio','presencial','diurno','2026-2'),

('of-pa-01','pa-01','Medicina','graduacao','presencial','integral','2026-2'),
('of-pb-01','pb-01','Odontologia','graduacao','presencial','integral','2026-2'),

('of-pr-01','pr-01','Engenharia','graduacao','presencial','integral','2026-2'),
('of-pr-02','pr-02','Direito','graduacao','presencial','diurno','2026-2'),
('of-pr-03','pr-03','Administração','graduacao','presencial','noturno','2026-2'),
('of-pr-04','pr-04','Ensino Fundamental','fundamental','presencial','diurno','2026-2'),
('of-pr-05','pr-05','Técnico em Automação Industrial','tecnico','presencial','diurno','2026-2'),

('of-pe-01','pe-01','Medicina','graduacao','presencial','integral','2026-2'),
('of-pi-01','pi-01','Administração','graduacao','presencial','noturno','2026-2'),

('of-rj-01','rj-01','Engenharia','graduacao','presencial','integral','2026-2'),
('of-rj-02','rj-02','Ciência da Computação','graduacao','presencial','diurno','2026-2'),
('of-rj-03','rj-03','Administração','graduacao','ead','flexivel','2026-2'),
('of-rj-04','rj-04','Técnico em Informática','tecnico','presencial','diurno','2026-2'),
('of-rj-05','rj-05','Ensino Médio','medio','presencial','diurno','2026-2'),

('of-rn-01','rn-01','Engenharia de Computação','graduacao','presencial','diurno','2026-2'),
('of-rs-01','rs-01','Engenharia Mecânica','graduacao','presencial','integral','2026-2'),
('of-ro-01','ro-01','Administração','graduacao','presencial','noturno','2026-2'),
('of-rr-01','rr-01','Técnico em Informática','tecnico','presencial','diurno','2026-2'),
('of-sc-01','sc-01','Engenharia de Produção','graduacao','presencial','integral','2026-2'),

('of-sp-01','sp-01','Administração','graduacao','presencial','diurno','2026-2'),
('of-sp-02','sp-02','Ciências Econômicas','graduacao','presencial','matutino','2026-2'),
('of-sp-03','sp-03','Direito','graduacao','presencial','diurno','2026-2'),
('of-sp-04','sp-04','Técnico em Desenvolvimento de Sistemas','tecnico','presencial','diurno','2026-2'),
('of-sp-05','sp-05','Ensino Fundamental','fundamental','presencial','diurno','2026-2'),

('of-se-01','se-01','Enfermagem','graduacao','presencial','integral','2026-2'),
('of-to-01','to-01','Administração','graduacao','presencial','noturno','2026-2')

ON CONFLICT (id) DO UPDATE SET
    instituicao_id = EXCLUDED.instituicao_id,
    curso_nome = EXCLUDED.curso_nome,
    nivel = EXCLUDED.nivel,
    modalidade = EXCLUDED.modalidade,
    turno = EXCLUDED.turno,
    periodo = EXCLUDED.periodo;

SELECT COUNT(*) AS total_instituicoes
FROM instituicoes;

SELECT COUNT(*) AS total_ofertas
FROM ofertas;

SELECT
    estado,
    COUNT(*) AS total
FROM instituicoes
GROUP BY estado
ORDER BY estado;