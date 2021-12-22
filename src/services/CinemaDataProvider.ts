import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    Record,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult
} from "react-admin"
import $api from "../http/config"
import {IPage} from "../models/response/IPage";


const CinemaDataProvider: DataProvider = {
    getList: function <RecordType extends Record = Record>(resource: string, params: GetListParams): Promise<GetListResult<RecordType>> {
        return $api.get<IPage<any>>(`/admin/${resource}?size=${params.pagination.perPage}&page=${params.pagination.page - 1}&sort=${params.sort.field},${params.sort.order}`)
            .then(response => {
                const list: GetListResult<RecordType> = {
                    data: response.data.content,
                    total: response.data.totalElements
                }
                console.log(list);
                return list;
            })
    },
    getOne: function <RecordType extends Record = Record>(resource: string, params: GetOneParams): Promise<GetOneResult<RecordType>> {
        return $api.get<any>(`/${resource}/${params.id}`)
            .then(response => {
                const oneResult: GetOneResult<RecordType> = {
                    data: response.data,
                    validUntil: new Date()
                }
                return oneResult;
            })

    }
    ,
    getMany: function <RecordType extends Record = Record>(resource: string, params: GetManyParams): Promise<GetManyResult<RecordType>> {
        return $api.get<any>(`/${resource}?id=${params.ids}`)
            .then(response => {
                const manyResult: GetManyResult<RecordType> = {
                    data: response.data,
                    validUntil: new Date()
                }
                return manyResult;
            })
    },
    getManyReference: function <RecordType extends Record = Record>(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult<RecordType>> {
        return $api.get<any>(`/admin/${resource}?${params.target}=${params.id}`)
            .then(response => {
                const manyReferenceResult: GetManyReferenceResult<RecordType> = {
                    data: response.data,
                    total: response.data.length,
                    validUntil: new Date()
                }
                return manyReferenceResult;
            })
    },
    update: function <RecordType extends Record = Record>(resource: string, params: UpdateParams<any>): Promise<UpdateResult<RecordType>> {
        if (!params.data.picture) {
            return $api.post<any>(`/admin/${resource}/${params.id}`, JSON.stringify(params.data))
                .then(response => {
                    const update: UpdateResult<RecordType> = {
                        data: response.data,
                        validUntil: new Date()
                    }
                    return update;
                })
        }

        return convertToBase64(params.data.picture.rawFile)
            .then(pic => $api.post<any>(`/admin/${resource}/${params.id}`, JSON.stringify({
                ...params.data,
                picture: pic
            })))
            .then(response =>
                new Promise<UpdateResult<RecordType>>(() => ({
                    data: response.data,
                    validUntil: new Date()
                } as UpdateResult<RecordType>))
            );
    },
    updateMany: function (resource: string, params: UpdateManyParams<any>): Promise<UpdateManyResult> {
        throw new Error("Function not implemented.")
    },
    create: function <RecordType extends Record = Record>(resource: string, params: CreateParams<any>): Promise<CreateResult<RecordType>> {
        console.log(params);
        if (!params.data.picture) {
            return $api.post<any>(`/admin/${resource}/create`, JSON.stringify(params.data))
                .then(response => {
                    const create: CreateResult<RecordType> = {
                        data: response.data,
                        validUntil: new Date()
                    }
                    return create;
                })
        }

        return convertToBase64(params.data.picture.rawFile)
            .then(pic => $api.post<any>(`/admin/${resource}/create`, JSON.stringify({
                ...params.data,
                picture: pic
            })))
            .then(response =>
                new Promise<CreateResult<RecordType>>(() => ({
                    data: response.data,
                    validUntil: new Date()
                } as CreateResult<RecordType>))
            );

    },
    delete: function <RecordType extends Record = Record>(resource: string, params: DeleteParams): Promise<DeleteResult<RecordType>> {
        return $api.delete<any>(`/admin/${resource}/${params.id}`)
            .then(response => {
                return {} as DeleteResult<RecordType>;
            });
    },
    deleteMany: function (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> {
        return $api.delete<any>(`/admin/${resource}?id=${params.ids}`)
            .then(response => {
                return {} as DeleteManyResult;
            })
    }
}

function convertToBase64(file: File): Promise<string> {
    console.log("sdgsdgdsgdsg")
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = err => reject(err);
    });
}

export default CinemaDataProvider;