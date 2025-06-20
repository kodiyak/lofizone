import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@workspace/ui/components/card';
import { MessagesSquareIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

const PromptCard: React.FC = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>#Prompt</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="absolute size-full left-0 top-0 z-10 bg-gradient-to-b from-transparent to-card"></div>
          <p className="text-sm leading-tight line-clamp-5 select-none">
            Lorem Ipsum é simplesmente uma simulação de texto da indústria
            tipográfica e de impressos, e vem sendo utilizado desde o século
            XVI, quando um impressor desconhecido pegou uma bandeja de tipos e
            os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum
            sobreviveu não só a cinco séculos, como também ao salto para a
            editoração eletrônica, permanecendo essencialmente inalterado. Se
            popularizou na década de 60, quando a Letraset lançou decalques
            contendo passagens de Lorem Ipsum, e mais recentemente quando passou
            a ser integrado a softwares de editoração eletrônica como Aldus
            PageMaker.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant={'outline'} asChild>
            <Link to={`/prompts/${'PROMPT_ID'}`}>
              <MessagesSquareIcon />
              <span>Ver prompt</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PromptCard;
