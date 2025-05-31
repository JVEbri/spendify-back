import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { QueryHelperDto } from './QueryHelper.dto';
@Injectable()
export class QueryHelperService {
  apply<T>(qb: SelectQueryBuilder<T>, query: QueryHelperDto, alias: string, allowedFields: string[] = []): SelectQueryBuilder<T> {
    const filter = query.filter || {};
    const sort: [string, 'ASC' | 'DESC'][] = query.sort || [];

    // Filtros dinámicos
    Object.entries(filter).forEach(([key, value]) => {
      const fullKey = key.includes('.') ? key : `${alias}.${key}`;
      if (allowedFields.length === 0 || allowedFields.includes(fullKey)) {
        qb.andWhere(`${fullKey} ILIKE :${key}`, { [key]: `%${value}%` });
      }
    });
    if (filter['month']) {
      qb.andWhere(`EXTRACT(MONTH FROM ${alias}.date) = :month`, {
        month: Number(filter['month']),
      });
    }
    if (filter['year']) {
      qb.andWhere(`EXTRACT(YEAR FROM ${alias}.date) = :year`, {
        year: Number(filter['year']),
      });
    }

    // Orden múltiple con prioridad
    sort.forEach(([field, direction]) => {
      const fullField = field.includes('.') ? field : `${alias}.${field}`;
      if (allowedFields.length === 0 || allowedFields.includes(fullField)) {
        qb.addOrderBy(fullField, direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
      }
    });

    // Paginación (solo si se proporciona limit)
    if (query.limit) {
      const page = Math.max(Number(query.page) || 1, 1);
      const limit = Math.min(query.limit, 100);
      qb.skip((page - 1) * limit).take(limit);
    }

    return qb;
  }
}
