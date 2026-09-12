import Button from "../components/button";
import ButtonIcon from "../components/button-icon";
import ChevronLeftIcon from "../assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "../assets/icons/chevron-right.svg?react";
import Badge from "../components/badge";
import Alert from "../components/alert";
import Divider from "../components/divider";
import InputText from "../components/input-text";
import SearchIcon from "../assets/icons/search.svg?react";
import InputCheckbox from "../components/input-checkbox";
import InputSingleFile from "../components/input-single-file";
import {useForm} from "react-hook-form";
import ImagePreview from "../components/image-preview";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../components/dialog";
import Text from "../components/text";
import {DialogClose} from "@radix-ui/react-dialog";

export default function PageComponents() {
  const form = useForm();
  const file = form.watch("file");
  const fileSource = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

  return (
    <div className="grid gap-7 p-6">
      <div className="flex gap-3">
        <Button>Button</Button>
        <Button variant="secondary">Button</Button>
        <Button disabled>Button</Button>
        <Button handling>Loading</Button>
        <Button icon={ChevronRightIcon}>Next Image</Button>
        <Button variant="ghost" size="sm">
          Button
        </Button>
        <Button variant="primary" size="sm">
          Button
        </Button>
      </div>

      <div className="flex gap-3">
        <ButtonIcon icon={ChevronLeftIcon} />
        <ButtonIcon icon={ChevronRightIcon} variant="secondary" />
      </div>

      <div className="flex gap-3">
        <Badge>All</Badge>
        <Badge>Nature</Badge>
        <Badge>Travel</Badge>
        <Badge loading>Travel</Badge>
        <Badge loading>Travel</Badge>
        <Badge loading>Travel</Badge>
      </div>

      <div>
        <Alert>
          Maximum size: 50MB
          <br />
          You can select PNG, JPG, JPEG or WEBP files
        </Alert>
      </div>

      <div>
        <Divider />
      </div>

      <div>
        <InputText icon={SearchIcon} placeholder="Search photo" />
      </div>

      <div>
        <InputCheckbox />
      </div>

      <div>
        <InputSingleFile
          form={form}
          allowedExtensions={["png", "jpg", "jpeg", "webp"]}
          maxFileSizeInMB={50}
          replaceBy={<ImagePreview src={fileSource} alt="Image" />}
          {...form.register("file")}
        />
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Test dialog</DialogHeader>
            <DialogBody>
              <Text as="div" className="mb-4">
                Test dialog content
              </Text>
              <InputSingleFile
                form={form}
                allowedExtensions={["png", "jpg", "jpeg", "webp"]}
                maxFileSizeInMB={50}
                replaceBy={<ImagePreview src={fileSource} alt="Image" />}
                {...form.register("file")}
              />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>

              <Button>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
