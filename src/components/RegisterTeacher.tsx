import { FileImage } from "phosphor-react";
import { Form } from "./Form";
import { Button } from "../components/Button";
import classNames from "classnames";
import { FormEvent, useEffect, useState } from "react";
import { TypeTeacher } from "../types/TypeTeacher";
import { useCreateTeacherMutation } from "../graphql/generated";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContextValues } from "../hooks/useContext";

export const RegisterTeacher = () => {
  const [teacherValues, setTeacherValues] = useState<TypeTeacher>(
    {} as TypeTeacher
  );
  const { handleSubmitUserInSessionStorage } = useContextValues();
  const [imageSelected, setImageSelected] = useState<File>({} as File);
  const navigate = useNavigate();
  const [createTeacher, { loading, error }] = useCreateTeacherMutation();

  useEffect(() => {
    if (imageSelected.size > 1) {
      uploadImage();
    }
  }, [imageSelected]);

  async function handleSubscribeTeacher(event: FormEvent) {
    event.preventDefault();

    try {
      await createTeacher({
        variables: {
          name: teacherValues.name.trim(),
          avatarURL: teacherValues.avatarURL,
          email: teacherValues.email.trim(),
          bio: teacherValues.bio.trim(),
          slug: teacherValues.slug,
          password: teacherValues.password.trim(),
        },
      })
        .then(() => {
          const isSubscriber = false;
          handleSubmitUserInSessionStorage(
            teacherValues.name,
            teacherValues.email.trim(),
            teacherValues.slug,
            isSubscriber
          );
          return navigate(`/instructor/event/${teacherValues.slug}`);
        })
        .catch((error) => {
          console.log(error + "Falha ao criar professor");
        });
    } catch (error) {
      console.log(error);
    }
  }

  function handleInput() {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("name", "image");
    input.setAttribute("accept", "image/*");
    input.onchange = async (event) => {
      const target = event.currentTarget as HTMLInputElement;
      if (target.files != undefined && target.files.length > 0) {
        const file = target.files[0];
        setImageSelected(file);
      }
    };
    input.click();
  }

  async function uploadImage() {
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "k4erurrg");

    try {
      await axios
        .post(
          "https://api.cloudinary.com/v1_1/lucas-gomes-dnasty/image/upload",
          formData
        )
        .then(async (response) => {
          const avatarURL: string = await response.data.secure_url;
          setTeacherValues({ ...teacherValues, ["avatarURL"]: avatarURL });
        });
    } catch (error) {
      throw new Error("Failed to upload the image");
    }
  }

  return (
    <div className="p-8 bg-gray-700 border border-gray-500 rounded">
      <strong className="text-2xl m-6 block">Inscrição do Professor</strong>
      <div className="flex flex-col gap-2">
        <Form
          teacherValues={teacherValues}
          setTeacherValues={setTeacherValues}
          handleSubscribe={handleSubscribeTeacher}
        >
          <div className="relative">
            <input
              className="peer"
              placeholder=""
              value={teacherValues.password || ""}
              id="password"
              name="password"
              type="password"
              onChange={(event) => {
                const { name, value } = event.target;
                setTeacherValues!({
                  ...teacherValues!,
                  [name]: value,
                });
              }}
            />
            <label
              htmlFor="password"
              className={classNames(
                "absolute bg-gray-700 rounded top-4 w-[90%] left-5 cursor-text peer-focus:px-1 peer-focus:max-w-max peer-focus:text-xs peer-focus:text-blue-500 peer-focus:-top-2 transition-all",
                {
                  "-top-2 text-xs transition-al px-1 max-w-max":
                    teacherValues?.password,
                }
              )}
            >
              Crie sua senha
            </label>
          </div>
          <textarea
            name="bio"
            className="bg-gray-700 rounded border-2 border-opacity-50 placeholder:text-[#E1E1E6] focus:placeholder:text-blue-500 outline-none focus:text-blue-500 focus:border-blue-500 border-black px-5 h-24 py-2 max-h-[200px] min-h-[90px]"
            placeholder="Escreva uma breve descrição sobre você"
            onChange={(event) =>
              setTeacherValues({
                ...teacherValues,
                [event.target.name]: event.target.value,
              })
            }
          />
          <div className="flex flex-col">
            <div>
              <div
                className={classNames(
                  "max-w-max flex gap-1 items-baseline group hover:cursor-pointer",
                  { "opacity-30": !imageSelected.size }
                )}
                onClick={handleInput}
              >
                <span className="group-hover:text-green-500">
                  Envie sua imagem
                </span>
                <FileImage size={19} className="group-hover:text-green-500" />
              </div>
            </div>
            {
              <Button
                type="submit"
                disabled={
                  loading ||
                  !teacherValues.name ||
                  !teacherValues.email ||
                  !teacherValues.bio ||
                  !teacherValues.avatarURL
                }
              >
                Cadastrar
              </Button>
            }
          </div>
        </Form>
        <span
          onClick={() => {
            navigate("/instructor/login");
          }}
        >
          <a className="text-sm font-semibold hover:text-green-500 hover:cursor-pointer hover:border-green-500">
            Fazer Login
          </a>
        </span>
        {error && (
          <span className="text-sm font-semibold text-red-900">
            Teacher already exists
          </span>
        )}
      </div>
    </div>
  );
};
