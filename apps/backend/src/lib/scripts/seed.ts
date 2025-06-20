import axios from 'axios';
import { db } from '../clients/db';
import { generateId } from '../../utils/ids';
import { createBook } from '../../modules/books/books';

async function main() {
  // await seedMembers();
  await seedBooks();
}

const get = (url: string) => {
  return axios.get(url).then((res) => res.data);
};
async function seedBooks() {
  const { books } = await get('https://bible-api.com/data/almeida');
  for (const index in books) {
    const order = Number(index) + 1;
    const book = books[index];
    await seedBook({
      ...book,
      order,
    });
  }
}

async function seedBook(book: { id: string; name: string; url: string; order: number }) {
  const { order, url, id } = book;
  const { chapters } = await loadBook(id, url);

  return await createBook({
    name: book.name,
    abbreviation: book.id,
    order,
    testament: order > 39 ? 'NT' : 'OT',
    chapters: chapters.map((chapter) => ({
      number: chapter.chapter,
      verses: chapter.verses.map((verse) => ({
        number: verse.number,
        text: verse.text,
      })),
    })),
  });
}

async function loadBook(name: string, url: string) {
  const { chapters } = await get(url);
  const chaptersResult: {
    chapter: number;
    verses: {
      number: number;
      text: string;
    }[];
  }[] = [];
  for (const chapter of chapters) {
    const { verses } = await get(chapter.url);
    const versesResult = verses.map((verse: any) => ({
      number: verse.verse,
      text: verse.text,
    }));
    chaptersResult.push({
      chapter: chapter.chapter,
      verses: versesResult,
    });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log(`[${name}] Chapter ${chapter.chapter}/${chapters.length} +${verses.length} verses`);
  }

  return {
    chapters: chaptersResult,
  };
}

async function seedMembers() {
  const phone = '5511991174114';
  const memberId = generateId('mem');
  const familyId = generateId('fam');
  const member = await db.member.upsert({
    where: { phone },
    create: {
      id: memberId,
      phone,
      name: 'Mathews William Teodoro de Oliveira',
      family: {
        connectOrCreate: {
          where: { id: familyId },
          create: {
            id: familyId,
            name: 'Teodoro de Oliveira',
          },
        },
      },
    },
    update: {
      name: 'Mathews William Teodoro de Oliveira',
    },
  });

  console.log(`Member ${member.name} (${member.id}) created/updated`);
}

main();
