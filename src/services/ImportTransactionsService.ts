import { getRepository } from 'typeorm';
import path from 'path';
import csvtojson from 'csvtojson';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    const appDir = path.resolve(__dirname, '..', '..', 'tmp');

    const records = await csvtojson().fromFile(`${appDir}/${fileName}`);

    const transactions: Transaction[] = [];
    for (let i = 0; i < records.length; i++) {
      let fullCategory = await categoriesRepository.findOne({
        where: { title: records[i].category },
      });
      if (!fullCategory) {
        fullCategory = categoriesRepository.create({
          title: records[i].category,
        });
        await categoriesRepository.save(fullCategory);
      }

      const transaction = transactionsRepository.create({
        title: records[i].title,
        value: parseFloat(records[i].value),
        type: records[i].type,
        category_id: fullCategory.id,
      });
      transactions.push(transaction);
    }

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
