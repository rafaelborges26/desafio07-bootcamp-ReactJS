import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
     const data = new FormData();

     if(!uploadedFiles.length) return //se nao tiver arquivo retorna e nao faz nada

     const file = uploadedFiles[0] //formato single, por isso so pegamos o primeiro arquivo mesmo

     // Formato de append usado: (name, value, filename)
    data.append('file', file.file, file.name) //nome que ta setado no backend, o arquivo, o nome

    try {
       await api.post('/transactions/import', data);

       history.push('/')
    } catch (err) {
       console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const uploadFiles = files.map(file => ({
      file,
      name: file.name, //setando o nome do arquivo
      readableSize: filesize(file.size), //setandno um tamanho legivel em MB ou KB
    })

    )
      setUploadedFiles(uploadFiles)
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
