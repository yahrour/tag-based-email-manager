import { fetchApi } from "@/api/emails";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import type { tagsResponse } from "@/types";
import useSWR from "swr";

type propsType = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagsList({ selectedTags, setSelectedTags }: propsType) {
  const { data: tags, isLoading, error } = useSWR<tagsResponse>("/api/tags", fetchApi);

  if (isLoading) {
    return (
      <MultiSelect
        values={selectedTags}
        onValuesChange={(values: string[]) => setSelectedTags(values)}
      >
        <MultiSelectTrigger className="w-full max-w-[400px]">
          <MultiSelectValue overflowBehavior="cutoff" placeholder="Select Tags" />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectGroup>
            {tags?.data.map((ele) => (
              <MultiSelectItem key={ele.tag} value={ele.tag}>
                {ele.tag}
              </MultiSelectItem>
            ))}
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
    );
  }

  if (error) {
    return <div>Error while loading tags</div>;
  }

  return (
    <MultiSelect
      values={selectedTags}
      onValuesChange={(values: string[]) => setSelectedTags(values)}
    >
      <MultiSelectTrigger className="w-full max-w-[400px]">
        <MultiSelectValue overflowBehavior="cutoff" placeholder="Select Tags" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {tags?.data.map((ele) => (
            <MultiSelectItem key={ele.tag} value={ele.tag}>
              {ele.tag}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
