from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from tensorflow.keras.layers import Dropout
import tensorflow as tf
from tensorflow.keras import layers
import pathlib
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.applications import EfficientNetV2B0
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam

es = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
kk = pathlib.Path('classses')
gpus = tf.config.list_physical_devices('GPU')
print("GPUs available:", gpus)

td = tf.keras.utils.image_dataset_from_directory(
    kk,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(240, 240),
    batch_size=32
)

tv = tf.keras.utils.image_dataset_from_directory(
    kk,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(240, 240),
    batch_size=64
)

cn = td.class_names
print(cn)
nml = layers.Rescaling(1./255)
td = td.map(lambda x, y: (nml(x), y))
tv = tv.map(lambda x, y: (nml(x), y))
image_batch, labels_batch = next(iter(td))
first_image = image_batch[0]
nc = len(cn)
print(np.min(first_image), np.max(first_image))

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.3,
    horizontal_flip=True,
    fill_mode='nearest'
)

base_model = EfficientNetV2B0(
    input_shape=(240, 240, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = True

inputs = Input(shape=(240, 240, 3))
x = base_model(inputs, training=True)
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
outputs = Dense(nc, activation='softmax')(x)
model = Model(inputs, outputs)

model.compile(
    optimizer=Adam(learning_rate=1e-5),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
    metrics=['accuracy']
)

model.summary()
h = model.fit(
    td,
    validation_data=tv,
    epochs=10,
    callbacks=[es]
)

acc = h.history['accuracy']
val_acc = h.history['val_accuracy']
loss = h.history['loss']
val_loss = h.history['val_loss']
print("Final Training Accuracy:", h.history['accuracy'][-1])
print("Final Validation Accuracy:", h.history['val_accuracy'][-1])
model.save("classifier.keras")