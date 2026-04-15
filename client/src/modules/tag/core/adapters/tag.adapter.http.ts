import type { HttpClient } from "@/modules/shared/http/http-client";
import type { ITagPort } from "../ports/tag.port";
import type { TagDomainModel } from "../model/tag.domain-model";

export class TagHttpAdapter implements ITagPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<TagDomainModel.TagOverviewDto[]> {
    const result =
      await this.httpClient.get<TagDomainModel.TagOverviewDto[]>("/tags");
    if (result.error) throw new Error(result.error.message);
    return result.data.data;
  }

  async create(
    data: TagDomainModel.CreateTagDto,
  ): Promise<TagDomainModel.TagOverviewDto> {
    const result = await this.httpClient.post<TagDomainModel.TagOverviewDto>(
      "/tags",
      data,
    );
    if (result.error) throw new Error(result.error.message);
    return result.data.data;
  }

  async update(
    id: string,
    data: TagDomainModel.UpdateTagDto,
  ): Promise<TagDomainModel.TagOverviewDto> {
    const result = await this.httpClient.patch<TagDomainModel.TagOverviewDto>(
      `/tags/${id}`,
      data,
    );
    if (result.error) throw new Error(result.error.message);
    return result.data.data;
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/tags/${id}`);
    if (result.error) throw new Error(result.error.message);
  }
}
